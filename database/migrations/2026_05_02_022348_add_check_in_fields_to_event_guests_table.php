<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('event_guests', function (Blueprint $table) {
            if (!Schema::hasColumn('event_guests', 'checked_in_at')) {
                $table->timestamp('checked_in_at')->nullable()->after('status');
            }

            if (!Schema::hasColumn('event_guests', 'checked_in_by')) {
                $table->foreignId('checked_in_by')
                    ->nullable()
                    ->after('checked_in_at')
                    ->constrained('users')
                    ->nullOnDelete();
            }

            if (!Schema::hasColumn('event_guests', 'checkin_note')) {
                $table->text('checkin_note')->nullable()->after('checked_in_by');
            }
        });
    }

    public function down(): void
    {
        Schema::table('event_guests', function (Blueprint $table) {
            if (Schema::hasColumn('event_guests', 'checked_in_by')) {
                $table->dropForeign(['checked_in_by']);
            }

            if (Schema::hasColumn('event_guests', 'checkin_note')) {
                $table->dropColumn('checkin_note');
            }

            if (Schema::hasColumn('event_guests', 'checked_in_by')) {
                $table->dropColumn('checked_in_by');
            }

            if (Schema::hasColumn('event_guests', 'checked_in_at')) {
                $table->dropColumn('checked_in_at');
            }
        });
    }
};
