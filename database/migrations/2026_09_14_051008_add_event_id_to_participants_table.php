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
        // 1. Tambahkan kolom event_id yang nullable sementara
        Schema::table('participants', function (Blueprint $table) {
            $table->uuid('event_id')->nullable()->after('id');
            // Menambahkan foreign key constraint
            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
        });

        // 2. Data Migration: Buat Event default dari Setting yang ada dan hubungkan peserta lama
        $formFields = \Illuminate\Support\Facades\DB::table('settings')->where('key', 'guestbook_form_fields')->value('value');
        $formHeader = \Illuminate\Support\Facades\DB::table('settings')->where('key', 'guestbook_form_header')->value('value');
        $successConfig = \Illuminate\Support\Facades\DB::table('settings')->where('key', 'guestbook_success_config')->value('value');
        
        $defaultEventId = (string) \Illuminate\Support\Str::uuid();
        
        \Illuminate\Support\Facades\DB::table('events')->insert([
            'id' => $defaultEventId,
            'name' => 'Buku Tamu Utama',
            'slug' => 'main-event',
            'form_fields' => $formFields ?? '[]',
            'form_header' => $formHeader ?? '{}',
            'success_config' => $successConfig ?? '{}',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Hubungkan semua peserta lama ke event default ini
        \Illuminate\Support\Facades\DB::table('participants')->update(['event_id' => $defaultEventId]);

        // 4. Jadikan kolom event_id NOT NULL
        Schema::table('participants', function (Blueprint $table) {
            $table->uuid('event_id')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('participants', function (Blueprint $table) {
            $table->dropForeign(['event_id']);
            $table->dropColumn('event_id');
        });
    }
};
