<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('meetings', function (Blueprint $table) {
            $table->string('zoom_meeting_id')->nullable();
            $table->text('zoom_join_url')->nullable();
            $table->text('zoom_start_url')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('meetings', function (Blueprint $table) {
            $table->dropColumn(['zoom_meeting_id', 'zoom_join_url', 'zoom_start_url']);
        });
    }
};
