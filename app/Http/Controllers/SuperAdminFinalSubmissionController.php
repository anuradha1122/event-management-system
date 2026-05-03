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
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class SuperAdminFinalSubmissionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('SuperAdminFinalSubmission/Index', [
            'project' => [
                'name' => 'Smart Event Invitation & Planning System',
                'status' => 'Ready for Final Demo / Submission',
                'summary' => 'This dashboard provides quick access to the final project reports, testing documentation, handover documents, Super Admin monitoring pages, and core project modules.',
                'technology' => [
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

            'stats' => $this->stats(),

            'finalDocuments' => $this->finalDocuments(),

            'superAdminPages' => $this->superAdminPages(),

            'organizerPages' => $this->organizerPages(),

            'submissionChecklist' => $this->submissionChecklist(),

            'demoFlow' => $this->demoFlow(),

            'finalRemarks' => [
                'The system includes organizer-side event management, public invitation and RSVP workflow, planning modules, reporting, testing documentation, handover documentation, and Super Admin monitoring.',
                'PDF export links must use normal HTML anchor tags instead of Inertia Link components.',
                'Completed and cancelled events are readable but protected from modification.',
                'The project is ready for final demonstration, review, and submission.',
            ],
        ]);
    }

    private function stats(): array
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

    private function finalDocuments(): array
    {
        return [
            [
                'title' => 'Super Admin System Report PDF',
                'description' => 'Global system report with event statistics, organizer summary, recent events, and activity logs.',
                'route' => 'super-admin.system-report.pdf',
                'type' => 'pdf',
                'status' => 'ready',
            ],
            [
                'title' => 'Final Testing Documentation Page',
                'description' => 'Final testing dashboard with module testing summary, demo checklist, known issues, and readiness status.',
                'route' => 'super-admin.testing-documentation.index',
                'type' => 'page',
                'status' => 'ready',
            ],
            [
                'title' => 'Final Testing Documentation PDF',
                'description' => 'PDF version of the final testing documentation.',
                'route' => 'super-admin.testing-documentation.pdf',
                'type' => 'pdf',
                'status' => 'ready',
            ],
            [
                'title' => 'Final Project Handover Page',
                'description' => 'Final handover and submission summary page.',
                'route' => 'super-admin.project-handover.index',
                'type' => 'page',
                'status' => 'ready',
            ],
            [
                'title' => 'Final Project Handover PDF',
                'description' => 'PDF version of the project handover summary.',
                'route' => 'super-admin.project-handover.pdf',
                'type' => 'pdf',
                'status' => 'ready',
            ],
            [
                'title' => 'Master Final Submission PDF',
                'description' => 'PDF version of the master final submission dashboard.',
                'route' => 'super-admin.final-submission.pdf',
                'type' => 'pdf',
                'status' => 'ready',
            ],
        ];
    }

    private function superAdminPages(): array
    {
        return [
            [
                'title' => 'Super Admin Dashboard',
                'description' => 'Global dashboard showing system-level totals and recent activity.',
                'route' => 'super-admin.dashboard',
                'type' => 'page',
            ],
            [
                'title' => 'Manage All Events',
                'description' => 'View and filter all events created in the system.',
                'route' => 'super-admin.events.index',
                'type' => 'page',
            ],
            [
                'title' => 'Manage Users',
                'description' => 'View system users, roles, and organizer activity.',
                'route' => 'super-admin.users.index',
                'type' => 'page',
            ],
            [
                'title' => 'Global Activity Logs',
                'description' => 'Monitor event and system activity logs.',
                'route' => 'super-admin.activity-logs.index',
                'type' => 'page',
            ],
        ];
    }

    private function organizerPages(): array
    {
        return [
            [
                'title' => 'Events',
                'description' => 'Organizer event list and event management area.',
                'route' => 'events.index',
                'type' => 'page',
            ],
            [
                'title' => 'Notifications',
                'description' => 'Organizer notification center.',
                'route' => 'notifications.index',
                'type' => 'page',
            ],
        ];
    }

    private function submissionChecklist(): array
    {
        return [
            [
                'item' => 'Core event management completed',
                'status' => 'completed',
            ],
            [
                'item' => 'Public invitation and RSVP workflow completed',
                'status' => 'completed',
            ],
            [
                'item' => 'Guest management, check-in, follow-up, and interaction history completed',
                'status' => 'completed',
            ],
            [
                'item' => 'Planning modules completed: tasks, expenses, vendors, schedule, staff, reminders',
                'status' => 'completed',
            ],
            [
                'item' => 'Organizer dashboard and reports completed',
                'status' => 'completed',
            ],
            [
                'item' => 'Event lifecycle and closed-event protection completed',
                'status' => 'completed',
            ],
            [
                'item' => 'QA checklist completed',
                'status' => 'completed',
            ],
            [
                'item' => 'Organizer manual and manual PDF completed',
                'status' => 'completed',
            ],
            [
                'item' => 'Super Admin dashboard, events, users, logs, and system report completed',
                'status' => 'completed',
            ],
            [
                'item' => 'Final testing documentation page and PDF completed',
                'status' => 'completed',
            ],
            [
                'item' => 'Final project handover page and PDF completed',
                'status' => 'completed',
            ],
            [
                'item' => 'Master final submission dashboard completed',
                'status' => 'completed',
            ],
        ];
    }

    private function demoFlow(): array
    {
        return [
            [
                'step' => 'Login as Super Admin',
                'description' => 'Start from the Super Admin dashboard and verify global access.',
            ],
            [
                'step' => 'Open Master Final Submission Dashboard',
                'description' => 'Use this page as the main navigation point for final review.',
            ],
            [
                'step' => 'Review Super Admin pages',
                'description' => 'Open global dashboard, all events, users, and activity logs.',
            ],
            [
                'step' => 'Review final PDFs',
                'description' => 'Open System Report PDF, Testing Documentation PDF, and Project Handover PDF.',
            ],
            [
                'step' => 'Open an event as organizer',
                'description' => 'Show event details, guests, RSVP, dashboard, reports, QA checklist, and activity logs.',
            ],
            [
                'step' => 'Test public invitation link',
                'description' => 'Open invitation link without login and submit RSVP as guest.',
            ],
            [
                'step' => 'Show lifecycle protection',
                'description' => 'Complete or cancel an event and show that modification actions are blocked.',
            ],
            [
                'step' => 'Final conclusion',
                'description' => 'Confirm that the system is ready for final submission and future production improvements.',
            ],
        ];
    }
}
