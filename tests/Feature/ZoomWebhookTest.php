<?php

namespace Tests\Feature;

use App\Models\ZoomSchedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ZoomWebhookTest extends TestCase
{
    use RefreshDatabase;

    private const SECRET = 'unit-test-zoom-webhook-secret';

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.zoom.webhook_secret_token' => self::SECRET,
            'services.zoom.account_id' => 'rc3id-test-account',
            'app.timezone' => 'Asia/Jakarta',
        ]);
    }

    public function test_zoom_crc_validation_returns_the_required_hmac_response(): void
    {
        $plainToken = 'zoom-validation-token';

        $this->postJson('/webhooks/zoom', [
            'event' => 'endpoint.url_validation',
            'payload' => ['plainToken' => $plainToken],
        ])
            ->assertOk()
            ->assertExactJson([
                'plainToken' => $plainToken,
                'encryptedToken' => hash_hmac('sha256', $plainToken, self::SECRET),
            ]);
    }

    public function test_signed_meeting_created_webhook_imports_a_schedule(): void
    {
        $this->sendSigned($this->createdPayload());

        $this->assertDatabaseHas('zoom_schedules', [
            'title' => 'Rapat CnL',
            'division' => 'Umum',
            'pic_name' => 'Host Zoom',
            'meeting_date' => '2026-11-02',
            'start_time' => '09:00',
            'end_time' => '10:00',
            'zoom_id' => '987654321',
            'zoom_source_meeting_id' => '987654321',
            'source' => 'zoom',
            'status' => 'confirmed',
        ]);
    }

    public function test_duplicate_zoom_events_update_the_existing_schedule(): void
    {
        $this->sendSigned($this->createdPayload());
        $payload = $this->createdPayload();
        $payload['payload']['object']['topic'] = 'Rapat CnL diperbarui';
        $this->sendSigned($payload);

        $this->assertDatabaseCount('zoom_schedules', 1);
        $this->assertDatabaseHas('zoom_schedules', [
            'zoom_source_meeting_id' => '987654321',
            'title' => 'Rapat CnL diperbarui',
        ]);
    }

    public function test_deleted_zoom_meeting_is_marked_cancelled(): void
    {
        $this->sendSigned($this->createdPayload());
        $this->sendSigned([
            'event' => 'meeting.deleted',
            'payload' => [
                'account_id' => 'rc3id-test-account',
                'object' => ['id' => '987654321'],
                'operation' => 'all',
            ],
            'event_ts' => 1,
        ]);

        $this->assertDatabaseHas('zoom_schedules', [
            'zoom_source_meeting_id' => '987654321',
            'status' => 'cancelled',
        ]);
    }

    public function test_invalid_or_stale_webhook_signatures_are_rejected(): void
    {
        $body = json_encode($this->createdPayload(), JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
        $timestamp = (string) time();

        $this->call('POST', '/webhooks/zoom', [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_ZM_REQUEST_TIMESTAMP' => $timestamp,
            'HTTP_X_ZM_SIGNATURE' => 'v0=invalid',
        ], $body)->assertUnauthorized();

        $staleTimestamp = (string) (time() - 600);
        $staleSignature = 'v0=' . hash_hmac('sha256', 'v0:' . $staleTimestamp . ':' . $body, self::SECRET);
        $this->call('POST', '/webhooks/zoom', [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_ZM_REQUEST_TIMESTAMP' => $staleTimestamp,
            'HTTP_X_ZM_SIGNATURE' => $staleSignature,
        ], $body)->assertUnauthorized();

        $this->assertDatabaseCount('zoom_schedules', 0);
    }

    public function test_events_from_a_different_zoom_account_are_ignored(): void
    {
        $payload = $this->createdPayload();
        $payload['payload']['account_id'] = 'another-account';
        $this->sendSigned($payload)->assertNoContent();

        $this->assertDatabaseCount('zoom_schedules', 0);
    }

    private function sendSigned(array $payload)
    {
        $body = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        $timestamp = (string) time();
        $signature = 'v0=' . hash_hmac('sha256', 'v0:' . $timestamp . ':' . $body, self::SECRET);

        return $this->call('POST', '/webhooks/zoom', [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_ZM_REQUEST_TIMESTAMP' => $timestamp,
            'HTTP_X_ZM_SIGNATURE' => $signature,
        ], $body);
    }

    private function createdPayload(): array
    {
        return [
            'event' => 'meeting.created',
            'event_ts' => 1793606400000,
            'payload' => [
                'account_id' => 'rc3id-test-account',
                'object' => [
                    'id' => '987654321',
                    'host_id' => 'host-123',
                    'topic' => 'Rapat CnL',
                    'type' => 2,
                    'start_time' => '2026-11-02T09:00:00+07:00',
                    'timezone' => 'Asia/Jakarta',
                    'duration' => 60,
                    'join_url' => 'https://zoom.us/j/987654321',
                    'password' => 'private-test-passcode',
                ],
            ],
        ];
    }
}
