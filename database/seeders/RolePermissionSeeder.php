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
            /*
            |--------------------------------------------------------------------------
            | Dashboard
            |--------------------------------------------------------------------------
            */
            'view dashboard',

            /*
            |--------------------------------------------------------------------------
            | Users / Roles / Admin
            |--------------------------------------------------------------------------
            */
            'view users',
            'create users',
            'update users',
            'delete users',
            'manage roles',
            'assign roles',

            /*
            |--------------------------------------------------------------------------
            | Super Admin Area
            |--------------------------------------------------------------------------
            */
            'view super admin dashboard',
            'view super admin events',
            'view super admin users',
            'view super admin activity logs',
            'view super admin reports',
            'view final testing documentation',
            'view project handover',
            'view final submission dashboard',

            /*
            |--------------------------------------------------------------------------
            | Events
            |--------------------------------------------------------------------------
            */
            'view all events',
            'view own events',
            'view assigned events',
            'create events',
            'update own events',
            'update all events',
            'delete own events',
            'delete all events',

            /*
            |--------------------------------------------------------------------------
            | Event Lifecycle
            |--------------------------------------------------------------------------
            */
            'activate events',
            'complete events',
            'cancel events',
            'reopen events',

            /*
            |--------------------------------------------------------------------------
            | Guests
            |--------------------------------------------------------------------------
            */
            'view guests',
            'create guests',
            'update guests',
            'delete guests',
            'manage assigned guests',

            /*
            |--------------------------------------------------------------------------
            | Invitations
            |--------------------------------------------------------------------------
            */
            'view invitations',
            'generate invitations',
            'delete invitations',

            /*
            |--------------------------------------------------------------------------
            | RSVP Questions
            |--------------------------------------------------------------------------
            */
            'view questions',
            'create questions',
            'update questions',
            'delete questions',

            /*
            |--------------------------------------------------------------------------
            | RSVP Responses / Answers
            |--------------------------------------------------------------------------
            */
            'view responses',
            'view assigned responses',
            'export responses',

            /*
            |--------------------------------------------------------------------------
            | Guest Check-In
            |--------------------------------------------------------------------------
            */
            'view check-ins',
            'check in guests',
            'undo guest check-ins',
            'export check-ins',

            /*
            |--------------------------------------------------------------------------
            | Guest Follow-Ups
            |--------------------------------------------------------------------------
            */
            'view follow-ups',
            'send follow-ups',
            'mark follow-ups',
            'bulk follow-ups',
            'export follow-ups',

            /*
            |--------------------------------------------------------------------------
            | Guest Interactions
            |--------------------------------------------------------------------------
            */
            'view guest interactions',
            'create guest interactions',
            'delete guest interactions',

            /*
            |--------------------------------------------------------------------------
            | Planning Tasks
            |--------------------------------------------------------------------------
            */
            'view tasks',
            'create tasks',
            'update tasks',
            'complete tasks',
            'delete tasks',

            /*
            |--------------------------------------------------------------------------
            | Expenses / Budget
            |--------------------------------------------------------------------------
            */
            'view expenses',
            'create expenses',
            'update expenses',
            'delete expenses',
            'export expenses',

            /*
            |--------------------------------------------------------------------------
            | Vendors / Suppliers
            |--------------------------------------------------------------------------
            */
            'view vendors',
            'create vendors',
            'update vendors',
            'delete vendors',

            /*
            |--------------------------------------------------------------------------
            | Schedule / Timeline
            |--------------------------------------------------------------------------
            */
            'view schedules',
            'create schedules',
            'update schedules',
            'complete schedules',
            'delete schedules',

            /*
            |--------------------------------------------------------------------------
            | Staff Assignment
            |--------------------------------------------------------------------------
            */
            'view staff',
            'create staff',
            'update staff',
            'delete staff',

            /*
            |--------------------------------------------------------------------------
            | Reminders
            |--------------------------------------------------------------------------
            */
            'view reminders',
            'create reminders',
            'update reminders',
            'delete reminders',
            'send reminders',
            'cancel reminders',
            'retry reminders',
            'view reminder logs',
            'mark reminder logs reviewed',

            /*
            |--------------------------------------------------------------------------
            | Notifications
            |--------------------------------------------------------------------------
            */
            'view notifications',
            'review notifications',

            /*
            |--------------------------------------------------------------------------
            | Dashboards / Analytics
            |--------------------------------------------------------------------------
            */
            'view event dashboard',
            'view event analytics',

            /*
            |--------------------------------------------------------------------------
            | Activity Logs / Audit Trail
            |--------------------------------------------------------------------------
            */
            'view activity logs',
            'view all activity logs',

            /*
            |--------------------------------------------------------------------------
            | Reports / PDFs
            |--------------------------------------------------------------------------
            */
            'view final event report',
            'export final event report pdf',
            'view organizer manual',
            'export organizer manual pdf',
            'export super admin system report pdf',
            'export final testing documentation pdf',
            'export project handover pdf',
            'export final submission pdf',

            /*
            |--------------------------------------------------------------------------
            | QA / Testing
            |--------------------------------------------------------------------------
            */
            'view qa checklist',
            'update qa checklist',
            'reset qa checklist',

            /*
            |--------------------------------------------------------------------------
            | Documentation Pages
            |--------------------------------------------------------------------------
            */
            'view project summary',
            'view testing documentation',
            'view organizer documentation',
            'view handover documentation',
            'view final submission documentation',
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

        /*
        |--------------------------------------------------------------------------
        | Super Admin Permissions
        |--------------------------------------------------------------------------
        |
        | Super Admin gets everything. Democracy was considered and rejected.
        |
        */
        $superAdmin->syncPermissions(Permission::all());

        /*
        |--------------------------------------------------------------------------
        | Organizer Permissions
        |--------------------------------------------------------------------------
        |
        | Organizer can manage own event workflow fully.
        |
        */
        $organizer->syncPermissions([
            'view dashboard',

            'view own events',
            'create events',
            'update own events',
            'delete own events',

            'activate events',
            'complete events',
            'cancel events',
            'reopen events',

            'view guests',
            'create guests',
            'update guests',
            'delete guests',

            'view invitations',
            'generate invitations',
            'delete invitations',

            'view questions',
            'create questions',
            'update questions',
            'delete questions',

            'view responses',
            'export responses',

            'view check-ins',
            'check in guests',
            'undo guest check-ins',
            'export check-ins',

            'view follow-ups',
            'send follow-ups',
            'mark follow-ups',
            'bulk follow-ups',
            'export follow-ups',

            'view guest interactions',
            'create guest interactions',
            'delete guest interactions',

            'view tasks',
            'create tasks',
            'update tasks',
            'complete tasks',
            'delete tasks',

            'view expenses',
            'create expenses',
            'update expenses',
            'delete expenses',
            'export expenses',

            'view vendors',
            'create vendors',
            'update vendors',
            'delete vendors',

            'view schedules',
            'create schedules',
            'update schedules',
            'complete schedules',
            'delete schedules',

            'view staff',
            'create staff',
            'update staff',
            'delete staff',

            'view reminders',
            'create reminders',
            'update reminders',
            'delete reminders',
            'send reminders',
            'cancel reminders',
            'retry reminders',
            'view reminder logs',
            'mark reminder logs reviewed',

            'view notifications',
            'review notifications',

            'view event dashboard',
            'view event analytics',

            'view activity logs',

            'view final event report',
            'export final event report pdf',
            'view organizer manual',
            'export organizer manual pdf',

            'view qa checklist',
            'update qa checklist',
            'reset qa checklist',

            'view project summary',
            'view organizer documentation',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Event Staff Permissions
        |--------------------------------------------------------------------------
        |
        | Event Staff is intentionally limited. They help run an event, not rule
        | the whole kingdom.
        |
        */
        $eventStaff->syncPermissions([
            'view dashboard',

            'view assigned events',

            'view guests',
            'create guests',
            'update guests',
            'manage assigned guests',

            'view responses',
            'view assigned responses',

            'view check-ins',
            'check in guests',
            'undo guest check-ins',

            'view follow-ups',
            'mark follow-ups',

            'view guest interactions',
            'create guest interactions',

            'view schedules',

            'view reminders',
            'view reminder logs',

            'view notifications',

            'view event dashboard',
        ]);

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
