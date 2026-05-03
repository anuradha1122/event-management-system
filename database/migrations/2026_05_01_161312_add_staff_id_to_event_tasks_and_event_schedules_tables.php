<?php

use App\Models\EventStaff;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('event_tasks', function (Blueprint $table) {
            $table->foreignIdFor(EventStaff::class, 'staff_id')
                ->nullable()
                ->after('event_id')
                ->constrained('event_staff')
                ->nullOnDelete();
        });

        Schema::table('event_schedules', function (Blueprint $table) {
            $table->foreignIdFor(EventStaff::class, 'staff_id')
                ->nullable()
                ->after('event_id')
                ->constrained('event_staff')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('event_tasks', function (Blueprint $table) {
            $table->dropConstrainedForeignId('staff_id');
        });

        Schema::table('event_schedules', function (Blueprint $table) {
            $table->dropConstrainedForeignId('staff_id');
        });
    }
};
