<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_guest_interactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('event_id')
                ->constrained('events')
                ->cascadeOnDelete();

            $table->foreignId('guest_id')
                ->constrained('event_guests')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('type')->default('note');
            $table->string('channel')->nullable();

            $table->string('title')->nullable();
            $table->text('message')->nullable();
            $table->text('note')->nullable();

            $table->timestamp('interaction_at')->nullable();

            $table->timestamps();

            $table->index(['event_id', 'guest_id']);
            $table->index(['event_id', 'type']);
            $table->index(['event_id', 'channel']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_guest_interactions');
    }
};
