<?php

use App\Models\Event;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_expenses', function (Blueprint $table) {
            $table->id();

            $table->foreignIdFor(Event::class)
                ->constrained()
                ->cascadeOnDelete();

            $table->string('title');
            $table->string('category')->default('other');
            $table->text('description')->nullable();

            $table->decimal('estimated_amount', 12, 2)->default(0);
            $table->decimal('actual_amount', 12, 2)->default(0);
            $table->decimal('paid_amount', 12, 2)->default(0);

            $table->enum('payment_status', [
                'unpaid',
                'partial',
                'paid',
            ])->default('unpaid');

            $table->date('expense_date')->nullable();
            $table->string('vendor_name')->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index(['event_id', 'category']);
            $table->index(['event_id', 'payment_status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_expenses');
    }
};
