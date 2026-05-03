<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('event_guests', function (Blueprint $table) {
            $table->timestamp('checked_in_at')->nullable()->after('status');

            $table->foreignId('checked_in_by')
                ->nullable()
                ->after('checked_in_at')
                ->constrained('users')
                ->nullOnDelete();

            $table->text('checkin_note')->nullable()->after('checked_in_by');
        });
    }

    public function down(): void
    {
        Schema::table('event_guests', function (Blueprint $table) {
            $table->dropForeign(['checked_in_by']);
            $table->dropColumn([
                'checked_in_at',
                'checked_in_by',
                'checkin_note',
            ]);
        });
    }
};
