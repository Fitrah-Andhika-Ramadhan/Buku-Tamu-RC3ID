<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('participants', function (Blueprint $table) {
            // Speed up GROUP BY institution queries and COUNT
            $table->index('institution', 'idx_institution');
            $table->index('is_attending', 'idx_is_attending');
            $table->index('created_at', 'idx_created_at');
        });
    }

    public function down(): void
    {
        Schema::table('participants', function (Blueprint $table) {
            $table->dropIndex('idx_institution');
            $table->dropIndex('idx_is_attending');
            $table->dropIndex('idx_created_at');
        });
    }
};
