<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\ZoomSchedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ZoomTrackerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_the_zoom_tracker(): void
    {
        $this->get('/admin/zoom-tracker')->assertRedirect('/akses-internal-cnl');
    }

    public function test_verified_admin_can_load_the_tracker(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'zoom_manager']));

        $this->get('/admin/zoom-tracker?date=2026-11-02')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/ZoomTracker')
                ->where('date', '2026-11-02')
                ->where('dayName', 'Senin')
                ->has('schedules')
                ->has('daySchedules')
                ->has('stats'));
    }

    public function test_conflict_endpoint_detects_a_weekly_schedule_on_its_weekday(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'zoom_manager']));
        $this->createSchedule([
            'title' => 'Rapat rutin WP1',
            'is_recurring' => true,
            'meeting_date' => null,
            'day_of_week' => 'Senin',
            'start_time' => '09:00',
            'end_time' => '10:00',
        ]);

        $this->getJson('/admin/zoom-tracker/conflict?date=2026-11-02&start_time=09%3A30&end_time=10%3A30')
            ->assertOk()
            ->assertJsonPath('has_conflict', true)
            ->assertJsonPath('conflicts.0.title', 'Rapat rutin WP1');
    }

    public function test_conflict_endpoint_ignores_one_off_schedules_on_other_dates(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'zoom_manager']));
        $this->createSchedule([
            'title' => 'Rapat tanggal tertentu',
            'meeting_date' => '2026-11-02',
            'start_time' => '09:00',
            'end_time' => '10:00',
        ]);

        $this->getJson('/admin/zoom-tracker/conflict?date=2026-11-09&start_time=09%3A00&end_time=10%3A00')
            ->assertOk()
            ->assertJsonPath('has_conflict', false)
            ->assertJsonCount(0, 'conflicts');
    }

    public function test_store_rejects_overlapping_single_and_weekly_schedules(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'zoom_manager']));
        $this->createSchedule([
            'title' => 'Rapat CnL',
            'meeting_date' => '2026-11-02',
            'start_time' => '09:00',
            'end_time' => '10:00',
        ]);

        $this->from('/admin/zoom-tracker')->post('/admin/zoom-tracker', $this->schedulePayload([
            'title' => 'Rapat WP2',
            'meeting_date' => '2026-11-02',
            'start_time' => '09:30',
            'end_time' => '10:30',
        ]))->assertSessionHasErrors('schedule');

        $this->assertDatabaseCount('zoom_schedules', 1);

        $this->createSchedule([
            'title' => 'Rapat khusus Senin',
            'meeting_date' => '2026-11-02',
            'start_time' => '13:00',
            'end_time' => '14:00',
        ]);

        $this->from('/admin/zoom-tracker')->post('/admin/zoom-tracker', $this->schedulePayload([
            'title' => 'Rapat rutin Senin',
            'is_recurring' => true,
            'meeting_date' => null,
            'day_of_week' => 'Senin',
            'start_time' => '13:30',
            'end_time' => '14:30',
        ]))->assertSessionHasErrors('schedule');

        $this->assertDatabaseCount('zoom_schedules', 2);
    }

    public function test_update_does_not_conflict_with_the_schedule_being_edited(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'zoom_manager']));
        $schedule = $this->createSchedule([
            'title' => 'Rapat awal',
            'meeting_date' => '2026-11-02',
            'start_time' => '09:00',
            'end_time' => '10:00',
        ]);

        $this->put("/admin/zoom-tracker/{$schedule->id}", $this->schedulePayload([
            'title' => 'Rapat diperbarui',
            'meeting_date' => '2026-11-02',
            'start_time' => '09:00',
            'end_time' => '10:00',
        ]))->assertRedirect();

        $this->assertDatabaseHas('zoom_schedules', [
            'id' => $schedule->id,
            'title' => 'Rapat diperbarui',
        ]);
    }

    public function test_other_accounts_cannot_access_the_zoom_tracker(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']))
            ->get('/admin/zoom-tracker')
            ->assertForbidden();
    }

    public function test_zoom_only_account_cannot_access_the_general_admin_panel(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'zoom_manager']))
            ->get('/admin')
            ->assertForbidden();
    }

    public function test_zoom_only_account_is_sent_to_its_tracker_after_login(): void
    {
        User::factory()->create([
            'email' => 'zoom-manager@example.test',
            'role' => 'zoom_manager',
        ]);

        $this->post('/akses-internal-cnl', [
            'email' => 'zoom-manager@example.test',
            'password' => 'password',
        ])->assertRedirect('/admin/zoom-tracker');
    }

    private function createSchedule(array $overrides = []): ZoomSchedule
    {
        return ZoomSchedule::create(array_merge($this->schedulePayload(), $overrides));
    }

    private function schedulePayload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Meeting RC3ID',
            'division' => 'CnL',
            'pic_name' => 'PIC Test',
            'pic_contact' => null,
            'is_recurring' => false,
            'meeting_date' => '2026-11-02',
            'day_of_week' => null,
            'start_time' => '09:00',
            'end_time' => '10:00',
            'zoom_link' => 'https://zoom.us/j/123456789',
            'zoom_id' => '123 456 789',
            'zoom_passcode' => 'rc3id',
            'status' => 'confirmed',
            'notes' => null,
        ], $overrides);
    }
}
