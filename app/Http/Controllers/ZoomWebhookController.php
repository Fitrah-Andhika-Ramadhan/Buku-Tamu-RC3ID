<?php

namespace App\Http\Controllers;

use App\Jobs\SyncZoomScheduleToGoogleCalendar;
use App\Models\ZoomSchedule;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ZoomWebhookController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        $secret = (string) config('services.zoom.webhook_secret_token');
        if ($secret === '') {
            return response()->json(['message' => 'Zoom webhook is not configured.'], 503);
        }

        $event = $request->input('event');
        if ($event === 'endpoint.url_validation') {
            $plainToken = data_get($request->all(), 'payload.plainToken');
            if (!is_string($plainToken) || $plainToken === '') {
                return response()->json(['message' => 'Invalid validation request.'], 400);
            }

            return response()->json([
                'plainToken' => $plainToken,
                'encryptedToken' => hash_hmac('sha256', $plainToken, $secret),
            ]);
        }

        if (!$this->hasValidSignature($request, $secret)) {
            Log::warning('Rejected an invalid Zoom webhook signature.');
            return response()->json(['message' => 'Invalid webhook signature.'], 401);
        }

        $expectedAccountId = (string) config('services.zoom.account_id');
        $receivedAccountId = (string) data_get($request->all(), 'payload.account_id', '');
        if ($expectedAccountId !== '' && $receivedAccountId !== $expectedAccountId) {
            Log::warning('Ignored a Zoom webhook from an unconfigured account.');
            return response()->json(null, 204);
        }

        $payload = (array) $request->input('payload', []);
        $meeting = (array) ($payload['object'] ?? []);

        switch ($event) {
            case 'meeting.created':
            case 'meeting.updated':
                $this->upsertMeeting($meeting);
                break;
            case 'meeting.deleted':
            case 'meeting.permanently_deleted':
                $this->cancelMeeting($meeting, $payload);
                break;
        }

        return response()->json(null, 204);
    }

    private function hasValidSignature(Request $request, string $secret): bool
    {
        $timestamp = $request->header('x-zm-request-timestamp');
        $received = $request->header('x-zm-signature');
        if (!is_string($timestamp) || !ctype_digit($timestamp) || !is_string($received)) {
            return false;
        }

        if (abs(time() - (int) $timestamp) > 300) {
            return false;
        }

        $message = 'v0:' . $timestamp . ':' . $request->getContent();
        $expected = 'v0=' . hash_hmac('sha256', $message, $secret);

        return hash_equals($expected, $received);
    }

    private function upsertMeeting(array $meeting): void
    {
        $meetingId = (string) ($meeting['id'] ?? '');
        if ($meetingId === '') {
            Log::warning('Ignored a Zoom meeting webhook without a meeting ID.');
            return;
        }

        $schedule = ZoomSchedule::query()
            ->where('zoom_source_meeting_id', $meetingId)
            ->first();

        if (!$schedule) {
            $schedule = ZoomSchedule::query()->where('zoom_id', $meetingId)->first();
        }

        $startTime = $meeting['start_time'] ?? null;
        if (!$startTime && !$schedule) {
            Log::info('Skipped an unscheduled Zoom meeting because it has no start time.');
            return;
        }

        $isRecurring = false;
        $dayOfWeek = null;
        $recurrence = (array) ($meeting['recurrence'] ?? []);
        $weeklyDays = array_values(array_filter(array_map('trim', explode(',', (string) ($recurrence['weekly_days'] ?? '')))));
        $simpleWeeklySeries = (int) ($meeting['type'] ?? 0) === 8
            && (int) ($recurrence['type'] ?? 0) === 2
            && (int) ($recurrence['repeat_interval'] ?? 1) === 1
            && empty($recurrence['end_date_time'])
            && empty($recurrence['end_times'])
            && count($weeklyDays) === 1;
        if ($simpleWeeklySeries) {
            $dayOfWeek = [1 => 'Minggu', 2 => 'Senin', 3 => 'Selasa', 4 => 'Rabu', 5 => 'Kamis', 6 => 'Jumat', 7 => 'Sabtu'][(int) $weeklyDays[0]] ?? null;
            $isRecurring = $dayOfWeek !== null;
        }

        $timezone = (string) config('app.timezone', 'Asia/Jakarta');
        $start = null;
        $end = null;
        if ($startTime) {
            try {
                $start = CarbonImmutable::parse($startTime, (string) ($meeting['timezone'] ?? $timezone))
                    ->setTimezone($timezone);
                $duration = max(1, (int) ($meeting['duration'] ?? 60));
                $end = $start->addMinutes($duration);
            } catch (\Throwable $exception) {
                Log::warning('Ignored a Zoom meeting with an invalid start time.');
                return;
            }

            if ($start->toDateString() !== $end->toDateString()) {
                Log::info('Skipped a Zoom meeting that crosses midnight; the tracker does not support overnight intervals.');
                return;
            }
        }

        $topic = trim((string) ($meeting['topic'] ?? ''));
        $hostName = trim((string) ($meeting['host_name'] ?? $meeting['host_email'] ?? ''));
        $hostId = trim((string) ($meeting['host_id'] ?? ''));
        $notes = $schedule?->notes;
        if (!$notes) {
            $notes = 'Diimpor otomatis dari Zoom.';
        }
        if ((int) ($meeting['type'] ?? 0) === 8 && !$isRecurring) {
            $notes .= ' Pola seri berulang Zoom belum dapat direpresentasikan penuh; tracker mencatat kejadian berikutnya.';
        }
        if ($hostId !== '' && $hostName === '') {
            $notes .= ' Host ID: ' . $hostId . '.';
        }

        $attributes = [
            'title' => $topic !== '' ? $topic : ($schedule?->title ?: 'Meeting Zoom ' . $meetingId),
            'division' => $schedule?->division ?: 'Umum',
            'pic_name' => $hostName !== '' ? $hostName : ($schedule?->pic_name ?: 'Host Zoom'),
            'pic_contact' => $schedule?->pic_contact,
            'is_recurring' => $isRecurring,
            'meeting_date' => $isRecurring ? null : ($start?->toDateString() ?? $schedule?->meeting_date?->toDateString()),
            'day_of_week' => $isRecurring ? $dayOfWeek : null,
            'start_time' => $start?->format('H:i') ?? $schedule?->start_time ?? '09:00',
            'end_time' => $end?->format('H:i') ?? $schedule?->end_time ?? '10:00',
            'zoom_link' => $meeting['join_url'] ?? $schedule?->zoom_link,
            'zoom_id' => $meetingId,
            'zoom_passcode' => $meeting['password'] ?? $schedule?->zoom_passcode,
            'status' => 'confirmed',
            'notes' => $notes,
            'source' => 'zoom',
            'zoom_source_meeting_id' => $meetingId,
        ];

        $schedule ??= new ZoomSchedule();
        $schedule->fill($attributes);
        $schedule->save();

        if (config('services.google_calendar.enabled')) {
            SyncZoomScheduleToGoogleCalendar::dispatch($schedule->id)->afterResponse();
        }
    }

    private function cancelMeeting(array $meeting, array $payload): void
    {
        $meetingId = (string) ($meeting['id'] ?? '');
        if ($meetingId === '') {
            return;
        }

        $schedule = ZoomSchedule::query()->where('zoom_source_meeting_id', $meetingId)->first();
        if (!$schedule) {
            $schedule = ZoomSchedule::query()->where('zoom_id', $meetingId)->first();
        }

        if (!$schedule) {
            return;
        }

        if ($schedule->is_recurring && ($payload['operation'] ?? 'all') === 'single') {
            Log::info('A single occurrence of a recurring Zoom meeting was deleted; the weekly series remains active in the tracker.');
            return;
        }

        $schedule->update(['status' => 'cancelled', 'source' => 'zoom']);

        if (config('services.google_calendar.enabled')) {
            SyncZoomScheduleToGoogleCalendar::dispatch($schedule->id)->afterResponse();
        }
    }
}
