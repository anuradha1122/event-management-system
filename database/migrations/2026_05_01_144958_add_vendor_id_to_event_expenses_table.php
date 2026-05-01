<?php

use App\Models\EventVendor;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('event_expenses', function (Blueprint $table) {
            $table->foreignIdFor(EventVendor::class, 'vendor_id')
                ->nullable()
                ->after('event_id')
                ->constrained('event_vendors')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('event_expenses', function (Blueprint $table) {
            $table->dropConstrainedForeignId('vendor_id');
        });
    }
};
