<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('event_type')->nullable()->after('venue');
            $table->string('theme_color')->nullable()->after('event_type');
            $table->string('cover_image')->nullable()->after('theme_color');
            $table->string('dress_code')->nullable()->after('cover_image');
            $table->string('contact_name')->nullable()->after('dress_code');
            $table->string('contact_phone')->nullable()->after('contact_name');
            $table->string('map_link')->nullable()->after('contact_phone');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn([
                'event_type',
                'theme_color',
                'cover_image',
                'dress_code',
                'contact_name',
                'contact_phone',
                'map_link',
            ]);
        });
    }
};
