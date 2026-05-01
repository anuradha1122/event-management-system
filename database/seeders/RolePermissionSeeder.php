<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // Dashboard
            'view dashboard',

            // Users / Admin
            'view users',
            'create users',
            'update users',
            'delete users',
            'manage roles',

            // Events
            'view all events',
            'view own events',
            'create events',
            'update own events',
            'delete own events',
            'delete all events',

            // Guests
            'view guests',
            'create guests',
            'update guests',
            'delete guests',

            // Invitations
            'generate invitations',
            'view invitations',

            // RSVP Questions
            'view questions',
            'create questions',
            'update questions',
            'delete questions',

            // Responses
            'view responses',
            'export responses',

            // Assigned staff
            'view assigned events',
            'manage assigned guests',
            'view assigned responses',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        $superAdmin = Role::firstOrCreate([
            'name' => 'Super Admin',
            'guard_name' => 'web',
        ]);

        $organizer = Role::firstOrCreate([
            'name' => 'Organizer',
            'guard_name' => 'web',
        ]);

        $eventStaff = Role::firstOrCreate([
            'name' => 'Event Staff',
            'guard_name' => 'web',
        ]);

        $superAdmin->syncPermissions(Permission::all());

        $organizer->syncPermissions([
            'view dashboard',
            'view own events',
            'create events',
            'update own events',
            'delete own events',

            'view guests',
            'create guests',
            'update guests',
            'delete guests',

            'generate invitations',
            'view invitations',

            'view questions',
            'create questions',
            'update questions',
            'delete questions',

            'view responses',
            'export responses',
        ]);

        $eventStaff->syncPermissions([
            'view dashboard',
            'view assigned events',
            'view guests',
            'create guests',
            'update guests',
            'view responses',
            'view assigned responses',
            'manage assigned guests',
        ]);

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
