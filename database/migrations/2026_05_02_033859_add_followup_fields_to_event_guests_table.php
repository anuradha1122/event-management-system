<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('event_guests', function (Blueprint $table) {
            if (!Schema::hasColumn('event_guests', 'followup_sent_at')) {
                $table->timestamp('followup_sent_at')->nullable()->after('checkin_note');
            }

            if (!Schema::hasColumn('event_guests', 'followup_sent_by')) {
                $table->foreignId('followup_sent_by')
                    ->nullable()
                    ->after('followup_sent_at')
                    ->constrained('users')
                    ->nullOnDelete();
            }

            if (!Schema::hasColumn('event_guests', 'followup_count')) {
                $table->unsignedInteger('followup_count')
                    ->default(0)
                    ->after('followup_sent_by');
            }

            if (!Schema::hasColumn('event_guests', 'followup_note')) {
                $table->text('followup_note')
                    ->nullable()
                    ->after('followup_count');
            }
        });
    }

    public function down(): void
    {
        Schema::table('event_guests', function (Blueprint $table) {
            if (Schema::hasColumn('event_guests', 'followup_sent_by')) {
                $table->dropForeign(['followup_sent_by']);
            }

            if (Schema::hasColumn('event_guests', 'followup_note')) {
                $table->dropColumn('followup_note');
            }

            if (Schema::hasColumn('event_guests', 'followup_count')) {
                $table->dropColumn('followup_count');
            }

            if (Schema::hasColumn('event_guests', 'followup_sent_by')) {
                $table->dropColumn('followup_sent_by');
            }

            if (Schema::hasColumn('event_guests', 'followup_sent_at')) {
                $table->dropColumn('followup_sent_at');
            }
        });
    }
};
