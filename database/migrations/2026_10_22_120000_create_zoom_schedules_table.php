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
        Schema::create('zoom_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('division')->default('Umum');
            $table->string('pic_name');
            $table->string('pic_contact')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->date('meeting_date')->nullable();
            $table->string('day_of_week')->nullable();
            $table->string('start_time', 10);
            $table->string('end_time', 10);
            $table->text('zoom_link')->nullable();
            $table->string('zoom_id')->nullable();
            $table->string('zoom_passcode')->nullable();
            $table->string('status')->default('confirmed');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['meeting_date', 'status']);
            $table->index(['is_recurring', 'day_of_week', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('zoom_schedules');
    }
};
