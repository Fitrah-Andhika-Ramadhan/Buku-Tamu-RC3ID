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
        Schema::create('meetings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('event_id')->index();
            $table->string('title');
            $table->string('room_slug')->unique();
            $table->foreignId('host_id')->constrained('users')->onDelete('cascade');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meetings');
    }
};
