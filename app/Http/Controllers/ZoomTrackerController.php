<?php

namespace App\Http\Controllers;

use App\Jobs\SyncZoomScheduleToGoogleCalendar;
use App\Models\ZoomSchedule;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ZoomTrackerController extends Controller
{
    private const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    public function index(Request $request): Response
    {
        $validated = Validator::make($request->only('date'), [
            'date' => ['nullable', 'date_format:Y-m-d'],
        ])->validate();

        $date = $validated['date'] ?? Carbon::today()->toDateString();
        $dayName = ZoomSchedule::getDayName($date);
        $daySchedules = ZoomSchedule::forDate($date)->map(fn (ZoomSchedule $schedule) => $this->serializeSchedule($schedule));
        $allSchedules = ZoomSchedule::query()
            ->orderBy('is_recurring')
            ->orderBy('meeting_date')
            ->orderBy('start_time')
            ->get()
            ->map(fn (ZoomSchedule $schedule) => $this->serializeSchedule($schedule));

        $busySlots = 0;
        for ($slotStart = 8 * 60; $slotStart < 20 * 60; $slotStart += 30) {
            $slotEnd = $slotStart + 30;
            $isBusy = $daySchedules->contains(function (array $schedule) use ($slotStart, $slotEnd) {
                return $this->timeToMinutes($schedule['start_time']) < $slotEnd
                    && $this->timeToMinutes($schedule['end_time']) > $slotStart;
            });

            if ($isBusy) {
                $busySlots++;
            }
        }

        return Inertia::render('Admin/ZoomTracker', [
            'date' => $date,
            'dayName' => $dayName,
            'schedules' => $allSchedules,
            'daySchedules' => $daySchedules,
            'stats' => [
                'total' => $daySchedules->count(),
                'confirmed' => $daySchedules->where('status', 'confirmed')->count(),
                'tentative' => $daySchedules->where('status', 'tentative')->count(),
                'busySlots' => $busySlots,
                'availableSlots' => 24 - $busySlots,
            ],
        ]);
    }

    public function checkConflict(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => ['required', 'date_format:Y-m-d'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', function ($attribute, $value, $fail) use ($request) {
                if ($value <= (string) $request->input('start_time')) {
                    $fail('Jam selesai harus setelah jam mulai.');
                }
            }],
            'exclude_id' => ['nullable', 'integer', 'exists:zoom_schedules,id'],
            'is_recurring' => ['nullable', 'boolean'],
            'day_of_week' => ['nullable', Rule::in(self::DAYS)],
        ]);

        if (!empty($validated['is_recurring'])) {
            if (empty($validated['day_of_week'])) {
                throw ValidationException::withMessages(['day_of_week' => 'Pilih hari untuk jadwal rutin.']);
            }

            $result = ZoomSchedule::findRecurringConflicts(
                $validated['day_of_week'],
                $validated['start_time'],
                $validated['end_time'],
                $validated['exclude_id'] ?? null,
            );
        } else {
            $result = ZoomSchedule::findConflicts(
                $validated['date'],
                $validated['start_time'],
                $validated['end_time'],
                $validated['exclude_id'] ?? null,
            );
        }

        return response()->json([
            'has_conflict' => $result['has_conflict'],
            'day_name' => $result['day_name'],
            'conflicts' => $result['conflicts']->map(fn (ZoomSchedule $schedule) => $this->serializeSchedule($schedule)),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateSchedule($request);
        $this->ensureAvailable($validated);

        $schedule = ZoomSchedule::create($this->normalizeScheduleData($validated));
        $this->queueCalendarSync($schedule);

        return back()->with('success', 'Jadwal Zoom berhasil ditambahkan.');
    }

    public function update(Request $request, ZoomSchedule $zoomSchedule): RedirectResponse
    {
        $validated = $this->validateSchedule($request);
        $this->ensureAvailable($validated, $zoomSchedule->id);

        $zoomSchedule->update($this->normalizeScheduleData($validated));
        $this->queueCalendarSync($zoomSchedule);

        return back()->with('success', 'Jadwal Zoom berhasil diperbarui.');
    }

    public function destroy(ZoomSchedule $zoomSchedule): RedirectResponse
    {
        if (config('services.google_calendar.enabled') && $zoomSchedule->google_calendar_event_id) {
            SyncZoomScheduleToGoogleCalendar::dispatch($zoomSchedule->id, $zoomSchedule->google_calendar_event_id)->afterResponse();
        }

        $zoomSchedule->delete();

        return back()->with('success', 'Jadwal Zoom berhasil dihapus.');
    }

    private function validateSchedule(Request $request): array
    {
        $isRecurring = $request->boolean('is_recurring');

        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'division' => ['required', 'string', 'max:120'],
            'pic_name' => ['required', 'string', 'max:255'],
            'pic_contact' => ['nullable', 'string', 'max:40'],
            'is_recurring' => ['required', 'boolean'],
            'meeting_date' => [Rule::requiredIf(!$isRecurring), 'nullable', 'date_format:Y-m-d'],
            'day_of_week' => [Rule::requiredIf($isRecurring), 'nullable', Rule::in(self::DAYS)],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', function ($attribute, $value, $fail) use ($request) {
                if ($value <= (string) $request->input('start_time')) {
                    $fail('Jam selesai harus setelah jam mulai.');
                }
            }],
            'zoom_link' => ['nullable', 'url', 'max:2048'],
            'zoom_id' => ['nullable', 'string', 'max:100'],
            'zoom_passcode' => ['nullable', 'string', 'max:100'],
            'status' => ['required', Rule::in(['confirmed', 'tentative', 'cancelled'])],
            'notes' => ['nullable', 'string', 'max:5000'],
        ]);
    }

    private function ensureAvailable(array $data, ?int $excludeId = null): void
    {
        if (($data['status'] ?? null) === 'cancelled') {
            return;
        }

        $result = !empty($data['is_recurring'])
            ? ZoomSchedule::findRecurringConflicts($data['day_of_week'], $data['start_time'], $data['end_time'], $excludeId)
            : ZoomSchedule::findConflicts($data['meeting_date'], $data['start_time'], $data['end_time'], $excludeId);

        if (!$result['has_conflict']) {
            return;
        }

        $titles = $result['conflicts']->pluck('title')->filter()->unique()->implode(', ');
        $message = $titles
            ? "Jadwal berbenturan dengan: {$titles}."
            : 'Jadwal berbenturan dengan meeting lain pada waktu tersebut.';

        throw ValidationException::withMessages(['schedule' => $message]);
    }

    private function normalizeScheduleData(array $data): array
    {
        $data['is_recurring'] = (bool) $data['is_recurring'];
        $data['meeting_date'] = $data['is_recurring'] ? null : $data['meeting_date'];
        $data['day_of_week'] = $data['is_recurring'] ? $data['day_of_week'] : null;

        return $data;
    }

    private function serializeSchedule(ZoomSchedule $schedule): array
    {
        return [
            'id' => $schedule->id,
            'title' => $schedule->title,
            'division' => $schedule->division,
            'pic_name' => $schedule->pic_name,
            'pic_contact' => $schedule->pic_contact,
            'is_recurring' => (bool) $schedule->is_recurring,
            'meeting_date' => $schedule->meeting_date?->format('Y-m-d'),
            'day_of_week' => $schedule->day_of_week,
            'start_time' => substr($schedule->start_time, 0, 5),
            'end_time' => substr($schedule->end_time, 0, 5),
            'zoom_link' => $schedule->zoom_link,
            'zoom_id' => $schedule->zoom_id,
            'zoom_passcode' => $schedule->zoom_passcode,
            'status' => $schedule->status,
            'notes' => $schedule->notes,
            'source' => $schedule->source ?? 'manual',
        ];
    }

    private function queueCalendarSync(ZoomSchedule $schedule): void
    {
        if (config('services.google_calendar.enabled')) {
            SyncZoomScheduleToGoogleCalendar::dispatch($schedule->id)->afterResponse();
        }
    }

    private function timeToMinutes(string $time): int
    {
        [$hours, $minutes] = array_map('intval', explode(':', substr($time, 0, 5)));

        return ($hours * 60) + $minutes;
    }
}
