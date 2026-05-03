<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('event_guests', function (Blueprint $table) {
            $table->timestamp('followup_sent_at')->nullable()->after('checkin_note');

            $table->foreignId('followup_sent_by')
                ->nullable()
                ->after('followup_sent_at')
                ->constrained('users')
                ->nullOnDelete();

            $table->unsignedInteger('followup_count')
                ->default(0)
                ->after('followup_sent_by');

            $table->text('followup_note')
                ->nullable()
                ->after('followup_count');
        });
    }

    public function down(): void
    {
        Schema::table('event_guests', function (Blueprint $table) {
            $table->dropForeign(['followup_sent_by']);

            $table->dropColumn([
                'followup_sent_at',
                'followup_sent_by',
                'followup_count',
                'followup_note',
            ]);
        });
    }
};
