<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventActivityLog;
use App\Models\EventAnswer;
use App\Models\EventExpense;
use App\Models\EventGuest;
use App\Models\EventInvitation;
use App\Models\EventQaCheck;
use App\Models\EventQuestion;
use App\Models\EventReminder;
use App\Models\EventReminderLog;
use App\Models\EventSchedule;
use App\Models\EventStaff;
use App\Models\EventTask;
use App\Models\EventVendor;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Schema;

class SuperAdminProjectHandoverController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('SuperAdminProjectHandover/Index', [
            'project' => [
                'name' => 'Smart Event Invitation & Planning System',
                'purpose' => 'A Laravel and Inertia React based system for creating events, generating public invitation links, collecting RSVP responses, managing guests, planning event activities, monitoring reminders, tracking activity logs, and generating final reports.',
                'target_users' => [
                    'Super Admin',
                    'Organizer / Event Creator',
                    'Event Staff',
                    'Public Guests',
                ],
                'tech_stack' => [
                    'Laravel',
                    'Laravel Breeze',
                    'Inertia.js',
                    'React',
                    'MySQL',
                    'MAMP',
                    'Spatie Laravel Permission',
                    'DomPDF / barryvdh-laravel-dompdf',
                ],
                'local_url' => url('/'),
                'database' => config('database.connections.mysql.database'),
                'environment' => app()->environment(),
            ],

            'systemStats' => $this->systemStats(),

            'completedModules' => $this->completedModules(),

            'accessSummary' => $this->accessSummary(),

            'finalDocuments' => $this->finalDocuments(),

            'setupNotes' => $this->setupNotes(),

            'handoverChecklist' => $this->handoverChecklist(),

            'futureImprovements' => $this->futureImprovements(),

            'readiness' => [
                'status' => 'Ready for final demo and submission',
                'message' => 'The main functional modules, Super Admin monitoring tools, testing documentation, and reporting features have been completed. The system is ready for final demonstration, review, and handover.',
            ],
        ]);
    }

    private function systemStats(): array
    {
        return [
            'total_events' => $this->safeCount(Event::class),
            'draft_events' => $this->safeEventStatusCount('draft'),
            'active_events' => $this->safeEventStatusCount('active'),
            'completed_events' => $this->safeEventStatusCount('completed'),
            'cancelled_events' => $this->safeEventStatusCount('cancelled'),

            'total_users' => $this->safeCount(User::class),
            'total_guests' => $this->safeCount(EventGuest::class),
            'total_invitations' => $this->safeCount(EventInvitation::class),
            'total_questions' => $this->safeCount(EventQuestion::class),
            'total_answers' => $this->safeCount(EventAnswer::class),

            'total_tasks' => $this->safeCount(EventTask::class),
            'total_expenses' => $this->safeCount(EventExpense::class),
            'total_vendors' => $this->safeCount(EventVendor::class),
            'total_schedules' => $this->safeCount(EventSchedule::class),
            'total_staff' => $this->safeCount(EventStaff::class),

            'total_reminders' => $this->safeCount(EventReminder::class),
            'total_reminder_logs' => $this->safeCount(EventReminderLog::class),
            'total_qa_checks' => $this->safeCount(EventQaCheck::class),
            'total_activity_logs' => $this->safeCount(EventActivityLog::class),
        ];
    }

    private function safeCount(string $modelClass): int
    {
        try {
            return $modelClass::count();
        } catch (\Throwable $e) {
            return 0;
        }
    }

    private function safeEventStatusCount(string $status): int
    {
        try {
            if (!Schema::hasColumn('events', 'status')) {
                return 0;
            }

            return Event::where('status', $status)->count();
        } catch (\Throwable $e) {
            return 0;
        }
    }

    private function completedModules(): array
    {
        return [
            [
                'group' => 'Organizer Modules',
                'items' => [
                    'Event management',
                    'Guest management',
                    'RSVP question management',
                    'Invitation link generation',
                    'Guest check-in',
                    'Guest follow-ups',
                    'Guest interaction history',
                    'Event dashboard and analytics',
                    'Planning tasks',
                    'Budget / expenses',
                    'Vendors / suppliers',
                    'Schedule / timeline',
                    'Staff assignment',
                    'Reminders and reminder logs',
                    'Notification center',
                    'Event lifecycle management',
                    'Closed-event modification protection',
                ],
            ],
            [
                'group' => 'Public Guest Modules',
                'items' => [
                    'Public invitation page',
                    'Guest RSVP submission',
                    'Question answer submission',
                    'Guest response confirmation',
                    'No-login public invitation access',
                ],
            ],
            [
                'group' => 'Super Admin Modules',
                'items' => [
                    'Super Admin global dashboard',
                    'All events management page',
                    'Users / organizers management page',
                    'Global activity log monitor',
                    'Super Admin system report PDF',
                    'Final testing documentation page',
                    'Final testing documentation PDF',
                    'Final project handover page',
                ],
            ],
            [
                'group' => 'Reports and Documentation',
                'items' => [
                    'Final Event Report PDF',
                    'Event Project Summary Page',
                    'Organizer Manual Page',
                    'Organizer Manual PDF',
                    'QA / Testing Checklist',
                    'Final Testing Documentation Page',
                    'Final Testing Documentation PDF',
                    'Final Project Handover Summary',
                ],
            ],
        ];
    }

    private function accessSummary(): array
    {
        return [
            [
                'role' => 'Super Admin',
                'access' => 'Can view global system dashboard, all events, users, activity logs, testing documentation, system reports, and handover summary.',
                'status' => 'Configured',
            ],
            [
                'role' => 'Organizer / Event Creator',
                'access' => 'Can create and manage own events, guests, RSVP questions, planning modules, reminders, reports, and event lifecycle.',
                'status' => 'Configured',
            ],
            [
                'role' => 'Event Staff',
                'access' => 'Can be assigned to event responsibilities where needed. Staff assignment module is available.',
                'status' => 'Available',
            ],
            [
                'role' => 'Public Guest',
                'access' => 'Can open public invitation link without login, view event invitation, submit RSVP status, and answer event questions.',
                'status' => 'Configured',
            ],
        ];
    }

    private function finalDocuments(): array
    {
        return [
            [
                'title' => 'Super Admin System Report PDF',
                'description' => 'Global PDF report showing system summary, event status counts, monthly events, top organizers, recent events, and recent activity logs.',
                'route' => 'super-admin.system-report.pdf',
                'type' => 'pdf',
            ],
            [
                'title' => 'Final Testing Documentation PDF',
                'description' => 'Final PDF report showing tested modules, testing summary, demo checklist, known issues, and readiness status.',
                'route' => 'super-admin.testing-documentation.pdf',
                'type' => 'pdf',
            ],
            [
                'title' => 'Final Testing Documentation Page',
                'description' => 'Super Admin page for reviewing project testing status and final readiness.',
                'route' => 'super-admin.testing-documentation.index',
                'type' => 'page',
            ],
            [
                'title' => 'Super Admin Dashboard',
                'description' => 'Global dashboard with system-wide statistics and quick access links.',
                'route' => 'super-admin.dashboard',
                'type' => 'page',
            ],
            [
                'title' => 'Super Admin Activity Logs',
                'description' => 'Global audit monitor for reviewing system activity.',
                'route' => 'super-admin.activity-logs.index',
                'type' => 'page',
            ],
        ];
    }

    private function setupNotes(): array
    {
        return [
            [
                'title' => 'Backend',
                'description' => 'Laravel is used as the main backend framework with MVC structure, Eloquent models, migrations, controllers, and named routes.',
            ],
            [
                'title' => 'Authentication',
                'description' => 'Laravel Breeze authentication is used for login, logout, profile, and authenticated route protection.',
            ],
            [
                'title' => 'Frontend',
                'description' => 'Inertia.js with React is used for frontend pages while keeping Laravel routing and controllers.',
            ],
            [
                'title' => 'Database',
                'description' => 'MySQL is used as the database. Local development commonly uses MAMP with host 127.0.0.1 and port 8889.',
            ],
            [
                'title' => 'Roles and Permissions',
                'description' => 'Spatie Laravel Permission is used for role-based access control, including Super Admin and Organizer access.',
            ],
            [
                'title' => 'PDF Reports',
                'description' => 'barryvdh/laravel-dompdf is used to generate final reports and documentation PDFs.',
            ],
            [
                'title' => 'PDF Link Rule',
                'description' => 'PDF links must use normal HTML anchor tags instead of Inertia Link components to prevent raw PDF output rendering.',
            ],
            [
                'title' => 'Closed Event Protection',
                'description' => 'Completed and cancelled events remain readable but block write operations such as create, update, delete, check-in, follow-up, and reminder actions.',
            ],
        ];
    }

    private function handoverChecklist(): array
    {
        return [
            [
                'item' => 'Core event creation and management completed',
                'status' => 'completed',
            ],
            [
                'item' => 'Guest invitation and RSVP workflow completed',
                'status' => 'completed',
            ],
            [
                'item' => 'Event planning modules completed',
                'status' => 'completed',
            ],
            [
                'item' => 'Check-in, follow-up, and interaction history completed',
                'status' => 'completed',
            ],
            [
                'item' => 'Reminder and notification modules completed',
                'status' => 'completed',
            ],
            [
                'item' => 'Activity logging and audit trail completed',
                'status' => 'completed',
            ],
            [
                'item' => 'Event lifecycle and closed-event protection completed',
                'status' => 'completed',
            ],
            [
                'item' => 'Organizer reports and documentation completed',
                'status' => 'completed',
            ],
            [
                'item' => 'Super Admin monitoring modules completed',
                'status' => 'completed',
            ],
            [
                'item' => 'Final testing documentation completed',
                'status' => 'completed',
            ],
            [
                'item' => 'Final handover summary page completed',
                'status' => 'completed',
            ],
        ];
    }

    private function futureImprovements(): array
    {
        return [
            'Email and SMS gateway integration for real invitation delivery.',
            'Google Calendar integration for event schedules.',
            'Advanced analytics charts for RSVP, budget, and guest trends.',
            'QR based or token based check-in for larger events.',
            'Production deployment hardening with queue workers, scheduler, backups, and monitoring.',
            'Improved UI theme customization for invitation cards.',
            'Role-specific staff permissions for larger event teams.',
            'Exportable full project handover PDF.',
        ];
    }
}
