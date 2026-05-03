<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Make sure roles exist
        |--------------------------------------------------------------------------
        | This prevents errors if the seeder runs before RolePermissionSeeder.
        */
        Role::firstOrCreate(['name' => 'Super Admin']);
        Role::firstOrCreate(['name' => 'Organizer']);
        Role::firstOrCreate(['name' => 'Event Staff']);

        /*
        |--------------------------------------------------------------------------
        | Super Admin User
        |--------------------------------------------------------------------------
        */
        $superAdmin = User::firstOrCreate(
            [
                'email' => 'admin@smartinvitation.test',
            ],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        if (! $superAdmin->hasRole('Super Admin')) {
            $superAdmin->assignRole('Super Admin');
        }

        /*
        |--------------------------------------------------------------------------
        | Organizer User
        |--------------------------------------------------------------------------
        */
        $organizer = User::firstOrCreate(
            [
                'email' => 'organizer@smartinvitation.test',
            ],
            [
                'name' => 'Organizer User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        if (! $organizer->hasRole('Organizer')) {
            $organizer->assignRole('Organizer');
        }

        /*
        |--------------------------------------------------------------------------
        | Event Staff User
        |--------------------------------------------------------------------------
        */
        $eventStaff = User::firstOrCreate(
            [
                'email' => 'staff@smartinvitation.test',
            ],
            [
                'name' => 'Event Staff User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        if (! $eventStaff->hasRole('Event Staff')) {
            $eventStaff->assignRole('Event Staff');
        }
    }
}
