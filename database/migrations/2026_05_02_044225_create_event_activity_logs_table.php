<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('event_activity_logs')) {
            Schema::create('event_activity_logs', function (Blueprint $table) {
                $table->id();

                $table->foreignId('event_id')
                    ->constrained('events')
                    ->cascadeOnDelete();

                $table->foreignId('user_id')
                    ->nullable()
                    ->constrained('users')
                    ->nullOnDelete();

                $table->string('subject_type')->nullable();
                $table->unsignedBigInteger('subject_id')->nullable();

                $table->string('action');
                $table->text('description')->nullable();

                $table->json('properties')->nullable();

                $table->string('ip_address')->nullable();
                $table->text('user_agent')->nullable();

                $table->timestamps();

                $table->index('event_id');
                $table->index('user_id');
                $table->index('action');
                $table->index(['subject_type', 'subject_id']);
                $table->index(['event_id', 'action']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('event_activity_logs');
    }
};
