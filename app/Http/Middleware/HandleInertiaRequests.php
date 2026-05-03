<?php

namespace App\Http\Middleware;

use App\Models\Event;
use App\Models\EventReminder;
use App\Models\EventReminderLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $roles = $user
            ? $user->getRoleNames()->values()->toArray()
            : [];

        $permissions = $user
            ? $user->getAllPermissions()->pluck('name')->values()->toArray()
            : [];

        return [
            ...parent::share($request),

            'auth' => [
                /*
                |--------------------------------------------------------------------------
                | User Object
                |--------------------------------------------------------------------------
                |
                | Roles and permissions are kept inside auth.user too.
                | This supports components that check:
                | auth.user.roles
                | auth.user.permissions
                |
                */
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $roles,
                    'permissions' => $permissions,
                ] : null,

                /*
                |--------------------------------------------------------------------------
                | Direct Auth-Level Roles / Permissions
                |--------------------------------------------------------------------------
                |
                | This supports helper usage like:
                | hasRole(auth, 'Super Admin')
                | can(auth, 'create guests')
                |
                */
                'roles' => $roles,
                'permissions' => $permissions,
            ],

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
                'warning' => fn () => $request->session()->get('warning'),
            ],

            'notificationSummary' => fn () => $this->getNotificationSummary($request),
        ];
    }

    private function getNotificationSummary(Request $request): array
    {
        $user = $request->user();

        if (!$user) {
            return $this->emptyNotificationSummary();
        }

        try {
            if (
                !Schema::hasTable('events') ||
                !Schema::hasTable('event_reminders') ||
                !Schema::hasTable('event_reminder_logs')
            ) {
                return $this->emptyNotificationSummary();
            }

            $eventQuery = Event::query();

            if (!$user->hasRole('Super Admin')) {
                $eventQuery->where('user_id', $user->id);
            }

            $eventIds = $eventQuery->pluck('id');

            if ($eventIds->isEmpty()) {
                return $this->emptyNotificationSummary();
            }

            $overdueReminders = EventReminder::query()
                ->whereIn('event_id', $eventIds)
                ->where('status', 'pending')
                ->whereNotNull('remind_at')
                ->where('remind_at', '<', now())
                ->count();

            $failedEmails = EventReminderLog::query()
                ->whereIn('event_id', $eventIds)
                ->where('status', 'failed')
                ->whereNull('reviewed_at')
                ->count();

            $upcomingReminders = EventReminder::query()
                ->whereIn('event_id', $eventIds)
                ->where('status', 'pending')
                ->whereNotNull('remind_at')
                ->where('remind_at', '>=', now())
                ->count();

            return [
                'urgent_count' => $overdueReminders + $failedEmails,
                'overdue_reminders' => $overdueReminders,
                'failed_emails' => $failedEmails,
                'upcoming_reminders' => $upcomingReminders,
            ];
        } catch (\Throwable $e) {
            return $this->emptyNotificationSummary();
        }
    }

    private function emptyNotificationSummary(): array
    {
        return [
            'urgent_count' => 0,
            'overdue_reminders' => 0,
            'failed_emails' => 0,
            'upcoming_reminders' => 0,
        ];
    }
}
