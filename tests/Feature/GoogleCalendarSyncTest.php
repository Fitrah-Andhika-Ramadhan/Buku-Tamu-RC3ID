<?php

namespace Tests\Feature;

use App\Models\ZoomSchedule;
use App\Services\GoogleCalendarService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GoogleCalendarSyncTest extends TestCase
{
    use RefreshDatabase;

    public function test_schedule_is_inserted_into_the_configured_google_calendar(): void
    {
        [$email, $privateKey] = $this->serviceAccountKey();
        config([
            'cache.default' => 'array',
            'services.google_calendar.enabled' => true,
            'services.google_calendar.calendar_id' => 'rc3id-calendar@example.test',
            'services.google_calendar.service_account_email' => $email,
            'services.google_calendar.private_key' => $privateKey,
            'services.google_calendar.timezone' => 'Asia/Jakarta',
        ]);
        Cache::forget('google_calendar_access_token_' . hash('sha256', $email));

        Http::fakeSequence()
            ->push(['access_token' => 'test-access-token', 'expires_in' => 3600], 200)
            ->push(['id' => 'rc3id1'], 200);

        $schedule = ZoomSchedule::create([
            'title' => 'Rapat Google Calendar',
            'division' => 'CnL',
            'pic_name' => 'PIC Test',
            'is_recurring' => false,
            'meeting_date' => '2026-11-02',
            'start_time' => '09:00',
            'end_time' => '10:00',
            'zoom_link' => 'https://zoom.us/j/987654321',
            'zoom_id' => '987654321',
            'status' => 'confirmed',
        ]);

        $eventId = app(GoogleCalendarService::class)->sync($schedule);

        $this->assertSame('rc3id1', $eventId);
        Http::assertSent(fn ($request) => str_contains($request->url(), '/calendars/rc3id-calendar%40example.test/events')
            && $request->method() === 'POST'
            && $request['summary'] === 'Rapat Google Calendar'
            && $request['start']['dateTime'] === '2026-11-02T09:00:00+07:00'
            && str_contains($request['description'], 'Link Zoom: https://zoom.us/j/987654321'));
        Http::assertSentCount(2);
    }

    public function test_recurring_weekly_schedule_becomes_a_google_calendar_recurring_event(): void
    {
        [$email, $privateKey] = $this->serviceAccountKey();
        config([
            'cache.default' => 'array',
            'services.google_calendar.enabled' => true,
            'services.google_calendar.calendar_id' => 'rc3id-calendar@example.test',
            'services.google_calendar.service_account_email' => $email,
            'services.google_calendar.private_key' => $privateKey,
            'services.google_calendar.timezone' => 'Asia/Jakarta',
        ]);
        Cache::forget('google_calendar_access_token_' . hash('sha256', $email));

        Http::fakeSequence()
            ->push(['access_token' => 'test-access-token', 'expires_in' => 3600], 200)
            ->push(['id' => 'rc3id1'], 200);

        $schedule = ZoomSchedule::create([
            'title' => 'Rapat rutin',
            'division' => 'WP1',
            'pic_name' => 'PIC Test',
            'is_recurring' => true,
            'day_of_week' => 'Senin',
            'start_time' => '09:00',
            'end_time' => '10:00',
            'status' => 'confirmed',
        ]);

        app(GoogleCalendarService::class)->sync($schedule);

        Http::assertSent(fn ($request) => str_contains($request->url(), '/events')
            && $request->method() === 'POST'
            && $request['recurrence'] === ['RRULE:FREQ=WEEKLY;BYDAY=MO']);
    }

    private function serviceAccountKey(): array
    {
        $privateKey = file_get_contents(base_path('tests/Fixtures/google_calendar_test_private_key.pem'));
        $this->assertIsString($privateKey);

        return ['calendar-bot@example.test', $privateKey];
    }
}
