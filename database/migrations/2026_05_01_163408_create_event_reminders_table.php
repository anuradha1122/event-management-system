<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_reminders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('event_id')
                ->constrained('events')
                ->cascadeOnDelete();

            $table->foreignId('task_id')
                ->nullable()
                ->constrained('event_tasks')
                ->nullOnDelete();

            $table->foreignId('schedule_id')
                ->nullable()
                ->constrained('event_schedules')
                ->nullOnDelete();

            $table->foreignId('staff_id')
                ->nullable()
                ->constrained('event_staff')
                ->nullOnDelete();

            $table->string('title');
            $table->text('message')->nullable();

            $table->string('reminder_type')->default('general');
            $table->dateTime('remind_at');
            $table->string('status')->default('pending');

            $table->dateTime('sent_at')->nullable();

            $table->timestamps();

            $table->index(['event_id', 'status']);
            $table->index(['event_id', 'remind_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_reminders');
    }
};
