<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('zoom_schedules', function (Blueprint $table) {
            $table->string('source', 20)->default('manual');
            $table->string('zoom_source_meeting_id', 100)->nullable();
            $table->string('google_calendar_event_id', 255)->nullable();
            $table->timestamp('google_calendar_synced_at')->nullable();
            $table->text('google_calendar_sync_error')->nullable();

            $table->unique('zoom_source_meeting_id', 'zoom_schedules_zoom_source_meeting_id_unique');
            $table->unique('google_calendar_event_id', 'zoom_schedules_google_calendar_event_id_unique');
        });
    }

    public function down(): void
    {
        Schema::table('zoom_schedules', function (Blueprint $table) {
            $table->dropUnique('zoom_schedules_zoom_source_meeting_id_unique');
            $table->dropUnique('zoom_schedules_google_calendar_event_id_unique');
            $table->dropColumn([
                'source',
                'zoom_source_meeting_id',
                'google_calendar_event_id',
                'google_calendar_synced_at',
                'google_calendar_sync_error',
            ]);
        });
    }
};
