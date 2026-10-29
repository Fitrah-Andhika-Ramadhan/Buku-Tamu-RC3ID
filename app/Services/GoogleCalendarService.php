<?php

namespace App\Services;

use App\Models\ZoomSchedule;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class GoogleCalendarService
{
    private const TOKEN_URL = 'https://oauth2.googleapis.com/token';
    private const API_URL = 'https://www.googleapis.com/calendar/v3';
    private const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events';

    public function isEnabled(): bool
    {
        return (bool) config('services.google_calendar.enabled');
    }

    public function isConfigured(): bool
    {
        return filled(config('services.google_calendar.calendar_id'))
            && filled(config('services.google_calendar.service_account_email'))
            && filled(config('services.google_calendar.private_key'));
    }

    public function sync(ZoomSchedule $schedule): string
    {
        if (!$this->isEnabled()) {
            throw new RuntimeException('Google Calendar sync is disabled.');
        }

        if (!$this->isConfigured()) {
            throw new RuntimeException('Google Calendar service-account configuration is incomplete.');
        }

        $eventId = $schedule->google_calendar_event_id ?: $this->eventIdFor($schedule);
        $calendarId = rawurlencode((string) config('services.google_calendar.calendar_id'));
        $eventUrl = self::API_URL . "/calendars/{$calendarId}/events/" . rawurlencode($eventId);

        if ($schedule->status === 'cancelled') {
            $this->deleteEvent($eventId);
            return $eventId;
        }

        $event = $this->toGoogleEvent($schedule, $eventId);
        $token = $this->accessToken();

        if ($schedule->google_calendar_event_id) {
            $response = Http::withToken($token)->timeout(10)->patch($eventUrl, $event);

            if ($response->successful()) {
                return $eventId;
            }

            if ($response->status() !== 404) {
                $this->throwFor($response, 'update');
            }
        }

        $insert = Http::withToken($token)->timeout(10)->post(
            self::API_URL . "/calendars/{$calendarId}/events",
            $event,
        );

        if ($insert->status() === 409) {
            $retry = Http::withToken($token)->timeout(10)->patch($eventUrl, $event);
            $this->throwFor($retry, 'update existing');
            return $eventId;
        }

        $this->throwFor($insert, 'create');

        return (string) ($insert->json('id') ?: $eventId);
    }

    public function deleteEvent(?string $eventId): void
    {
        if (!$eventId || !$this->isEnabled()) {
            return;
        }

        if (!$this->isConfigured()) {
            throw new RuntimeException('Google Calendar service-account configuration is incomplete.');
        }

        $calendarId = rawurlencode((string) config('services.google_calendar.calendar_id'));
        $response = Http::withToken($this->accessToken())->timeout(10)->delete(
            self::API_URL . "/calendars/{$calendarId}/events/" . rawurlencode($eventId),
        );

        if ($response->status() !== 404 && $response->status() !== 410 && !$response->successful()) {
            $this->throwFor($response, 'delete');
        }
    }

    private function accessToken(): string
    {
        $email = (string) config('services.google_calendar.service_account_email');
        $cacheKey = 'google_calendar_access_token_' . hash('sha256', $email);

        return Cache::remember($cacheKey, now()->addMinutes(55), function () use ($email): string {
            $privateKey = str_replace('\\n', "\n", (string) config('services.google_calendar.private_key'));
            $now = time();
            $header = $this->base64UrlEncode(json_encode(['alg' => 'RS256', 'typ' => 'JWT'], JSON_THROW_ON_ERROR));
            $claims = $this->base64UrlEncode(json_encode([
                'iss' => $email,
                'scope' => self::CALENDAR_SCOPE,
                'aud' => self::TOKEN_URL,
                'iat' => $now,
                'exp' => $now + 3600,
            ], JSON_THROW_ON_ERROR));
            $signingInput = $header . '.' . $claims;

            $key = openssl_pkey_get_private($privateKey);
            if ($key === false || !openssl_sign($signingInput, $signature, $key, OPENSSL_ALGO_SHA256)) {
                throw new RuntimeException('Google Calendar service-account key could not be used.');
            }

            $assertion = $signingInput . '.' . $this->base64UrlEncode($signature);
            $response = Http::asForm()->timeout(10)->post(self::TOKEN_URL, [
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion' => $assertion,
            ]);

            $this->throwFor($response, 'authenticate');
            $token = $response->json('access_token');
            if (!is_string($token) || $token === '') {
                throw new RuntimeException('Google Calendar returned an empty access token.');
            }

            return $token;
        });
    }

    private function toGoogleEvent(ZoomSchedule $schedule, string $eventId): array
    {
        $timezone = (string) config('services.google_calendar.timezone', 'Asia/Jakarta');
        [$start, $end, $recurrence] = $this->eventTimes($schedule, $timezone);

        $description = array_filter([
            'Divisi: ' . $schedule->division,
            'PIC: ' . $schedule->pic_name,
            $schedule->pic_contact ? 'Kontak PIC: ' . $schedule->pic_contact : null,
            $schedule->zoom_id ? 'Zoom ID: ' . $schedule->zoom_id : null,
            $schedule->zoom_link ? 'Link Zoom: ' . $schedule->zoom_link : null,
            $schedule->notes ?: null,
            'Sumber: ' . ($schedule->source === 'zoom' ? 'Zoom' : 'Jadwal & Zoom Tracker'),
        ]);

        $event = [
            'id' => $eventId,
            'summary' => $schedule->title,
            'description' => implode("\n", $description),
            'start' => ['dateTime' => $start->toIso8601String(), 'timeZone' => $timezone],
            'end' => ['dateTime' => $end->toIso8601String(), 'timeZone' => $timezone],
            'status' => $schedule->status === 'tentative' ? 'tentative' : 'confirmed',
        ];

        if ($schedule->zoom_link) {
            $event['location'] = $schedule->zoom_link;
        }

        if ($recurrence) {
            $event['recurrence'] = [$recurrence];
        }

        return $event;
    }

    /** @return array{0: CarbonImmutable, 1: CarbonImmutable, 2: ?string} */
    private function eventTimes(ZoomSchedule $schedule, string $timezone): array
    {
        if ($schedule->is_recurring) {
            $byDay = [
                'Senin' => 'MO', 'Selasa' => 'TU', 'Rabu' => 'WE', 'Kamis' => 'TH',
                'Jumat' => 'FR', 'Sabtu' => 'SA', 'Minggu' => 'SU',
            ][$schedule->day_of_week] ?? null;

            if (!$byDay) {
                throw new RuntimeException('Unsupported recurring weekday for Google Calendar.');
            }

            $now = CarbonImmutable::now($timezone);
            $start = $now->setTimeFromTimeString(substr($schedule->start_time, 0, 5));
            $daysUntil = ($this->dayNumber($schedule->day_of_week) - $now->dayOfWeek + 7) % 7;
            if ($daysUntil === 0 && $start->lessThan($now)) {
                $daysUntil = 7;
            }
            $start = $start->addDays($daysUntil);
            $end = $start->setTimeFromTimeString(substr($schedule->end_time, 0, 5));

            return [$start, $end, 'RRULE:FREQ=WEEKLY;BYDAY=' . $byDay];
        }

        $date = $schedule->meeting_date?->format('Y-m-d');
        if (!$date) {
            throw new RuntimeException('A specific meeting date is required for Google Calendar sync.');
        }

        $start = CarbonImmutable::parse($date . ' ' . substr($schedule->start_time, 0, 5), $timezone);
        $end = CarbonImmutable::parse($date . ' ' . substr($schedule->end_time, 0, 5), $timezone);

        return [$start, $end, null];
    }

    private function dayNumber(string $dayName): int
    {
        return [
            'Minggu' => 0, 'Senin' => 1, 'Selasa' => 2, 'Rabu' => 3,
            'Kamis' => 4, 'Jumat' => 5, 'Sabtu' => 6,
        ][$dayName] ?? 0;
    }

    private function eventIdFor(ZoomSchedule $schedule): string
    {
        return 'rc3id' . strtolower(base_convert((string) $schedule->id, 10, 32));
    }

    private function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }

    private function throwFor(Response $response, string $operation): void
    {
        if (!$response->successful()) {
            throw new RuntimeException("Google Calendar {$operation} failed with HTTP {$response->status()}.");
        }
    }
}
