<?php

use App\Models\Event;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_tasks', function (Blueprint $table) {
            $table->id();

            $table->foreignIdFor(Event::class)
                ->constrained()
                ->cascadeOnDelete();

            $table->string('title');
            $table->text('description')->nullable();

            $table->enum('status', [
                'pending',
                'in_progress',
                'done',
            ])->default('pending');

            $table->enum('priority', [
                'low',
                'medium',
                'high',
            ])->default('medium');

            $table->date('due_date')->nullable();
            $table->string('assigned_to')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();

            $table->index(['event_id', 'status']);
            $table->index(['event_id', 'priority']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_tasks');
    }
};
