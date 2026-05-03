<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_qa_checks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('event_id')
                ->constrained('events')
                ->cascadeOnDelete();

            $table->string('check_key');
            $table->string('category')->nullable();
            $table->string('title');
            $table->text('description')->nullable();

            $table->string('status')->default('pending');
            $table->text('note')->nullable();

            $table->foreignId('tested_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('tested_at')->nullable();

            $table->timestamps();

            $table->unique(['event_id', 'check_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_qa_checks');
    }
};
