<?php

namespace App\Jobs;

use App\Models\ZoomSchedule;
use App\Services\GoogleCalendarService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

class SyncZoomScheduleToGoogleCalendar implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public array $backoff = [30, 120, 300];

    public function __construct(
        public int $scheduleId,
        public ?string $removedEventId = null,
    ) {
    }

    public function handle(GoogleCalendarService $calendar): void
    {
        if (!$calendar->isEnabled()) {
            return;
        }

        if ($this->removedEventId) {
            $calendar->deleteEvent($this->removedEventId);
            return;
        }

        $schedule = ZoomSchedule::find($this->scheduleId);
        if (!$schedule) {
            return;
        }

        try {
            $eventId = $calendar->sync($schedule);
            $schedule->forceFill([
                'google_calendar_event_id' => $eventId,
                'google_calendar_synced_at' => now(),
                'google_calendar_sync_error' => null,
            ])->saveQuietly();
        } catch (Throwable $exception) {
            $schedule->forceFill([
                'google_calendar_sync_error' => mb_substr($exception->getMessage(), 0, 2000),
            ])->saveQuietly();
            throw $exception;
        }
    }
}
