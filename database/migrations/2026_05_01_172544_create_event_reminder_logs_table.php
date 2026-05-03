<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_reminder_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('event_reminder_id')
                ->constrained('event_reminders')
                ->cascadeOnDelete();

            $table->foreignId('event_id')
                ->constrained('events')
                ->cascadeOnDelete();

            $table->string('recipient_email')->nullable();
            $table->string('recipient_type')->default('unknown');

            $table->string('status')->default('sent');
            $table->text('error_message')->nullable();

            $table->timestamp('sent_at')->nullable();

            $table->timestamps();

            $table->index(['event_id', 'status']);
            $table->index(['event_reminder_id', 'status']);
            $table->index(['recipient_email']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_reminder_logs');
    }
};
