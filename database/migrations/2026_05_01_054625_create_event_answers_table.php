<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('event_answers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('invitation_id')
                ->constrained('event_invitations')
                ->cascadeOnDelete();

            $table->foreignId('question_id')
                ->constrained('event_questions')
                ->cascadeOnDelete();

            $table->text('answer')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_answers');
    }
};
