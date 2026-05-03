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
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Schema;

class SuperAdminFinalSubmissionPdfController extends Controller
{
    public function pdf(): Response
    {
        $data = [
            'generatedAt' => now(),
            'generatedBy' => auth()->user(),

            'project' => [
                'name' => 'Smart Event Invitation & Planning System',
                'status' => 'Ready for Final Demo / Submission',
                'summary' => 'This report summarizes the final submission readiness of the Smart Event Invitation & Planning System. It includes project details, system statistics, final documents, Super Admin pages, organizer pages, checklist status, demo flow, and final remarks.',
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
        ];

        $pdf = Pdf::loadView('reports.final-submission', $data)
            ->setPaper('a4', 'portrait');

        return $pdf->stream('master-final-submission.pdf');
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
                'type' => 'PDF',
                'status' => 'Ready',
            ],
            [
                'title' => 'Final Testing Documentation Page',
                'description' => 'Final testing dashboard with module testing summary, demo checklist, known issues, and readiness status.',
                'type' => 'Page',
                'status' => 'Ready',
            ],
            [
                'title' => 'Final Testing Documentation PDF',
                'description' => 'PDF version of the final testing documentation.',
                'type' => 'PDF',
                'status' => 'Ready',
            ],
            [
                'title' => 'Final Project Handover Page',
                'description' => 'Final handover and submission summary page.',
                'type' => 'Page',
                'status' => 'Ready',
            ],
            [
                'title' => 'Final Project Handover PDF',
                'description' => 'PDF version of the project handover summary.',
                'type' => 'PDF',
                'status' => 'Ready',
            ],
            [
                'title' => 'Master Final Submission Dashboard',
                'description' => 'Central dashboard linking final documents, system pages, demo flow, and final submission checklist.',
                'type' => 'Page',
                'status' => 'Ready',
            ],
            [
                'title' => 'Master Final Submission PDF',
                'description' => 'PDF version of the master final submission dashboard.',
                'type' => 'PDF',
                'status' => 'Ready',
            ],
        ];
    }

    private function superAdminPages(): array
    {
        return [
            [
                'title' => 'Super Admin Dashboard',
                'description' => 'Global dashboard showing system-level totals and recent activity.',
                'type' => 'Page',
            ],
            [
                'title' => 'Manage All Events',
                'description' => 'View and filter all events created in the system.',
                'type' => 'Page',
            ],
            [
                'title' => 'Manage Users',
                'description' => 'View system users, roles, and organizer activity.',
                'type' => 'Page',
            ],
            [
                'title' => 'Global Activity Logs',
                'description' => 'Monitor event and system activity logs.',
                'type' => 'Page',
            ],
            [
                'title' => 'Testing Documentation',
                'description' => 'Review final testing status, tested modules, known issues, and readiness.',
                'type' => 'Page',
            ],
            [
                'title' => 'Project Handover',
                'description' => 'Review final project handover and submission summary.',
                'type' => 'Page',
            ],
            [
                'title' => 'Master Final Submission Dashboard',
                'description' => 'Central final dashboard for project submission and demo.',
                'type' => 'Page',
            ],
        ];
    }

    private function organizerPages(): array
    {
        return [
            [
                'title' => 'Events',
                'description' => 'Organizer event list and event management area.',
                'type' => 'Page',
            ],
            [
                'title' => 'Notifications',
                'description' => 'Organizer notification center.',
                'type' => 'Page',
            ],
            [
                'title' => 'Event Dashboard',
                'description' => 'Organizer analytics dashboard for each event.',
                'type' => 'Page',
            ],
            [
                'title' => 'Final Event Report PDF',
                'description' => 'Event-level PDF report with summary, guests, reminders, expenses, and activity logs.',
                'type' => 'PDF',
            ],
            [
                'title' => 'Organizer Manual',
                'description' => 'Organizer user guide page explaining how to use the system.',
                'type' => 'Page',
            ],
            [
                'title' => 'Organizer Manual PDF',
                'description' => 'PDF version of the organizer user manual.',
                'type' => 'PDF',
            ],
        ];
    }

    private function submissionChecklist(): array
    {
        return [
            [
                'item' => 'Core event management completed',
                'status' => 'Completed',
            ],
            [
                'item' => 'Public invitation and RSVP workflow completed',
                'status' => 'Completed',
            ],
            [
                'item' => 'Guest management, check-in, follow-up, and interaction history completed',
                'status' => 'Completed',
            ],
            [
                'item' => 'Planning modules completed: tasks, expenses, vendors, schedule, staff, reminders',
                'status' => 'Completed',
            ],
            [
                'item' => 'Organizer dashboard and reports completed',
                'status' => 'Completed',
            ],
            [
                'item' => 'Event lifecycle and closed-event protection completed',
                'status' => 'Completed',
            ],
            [
                'item' => 'QA checklist completed',
                'status' => 'Completed',
            ],
            [
                'item' => 'Organizer manual and manual PDF completed',
                'status' => 'Completed',
            ],
            [
                'item' => 'Super Admin dashboard, events, users, logs, and system report completed',
                'status' => 'Completed',
            ],
            [
                'item' => 'Final testing documentation page and PDF completed',
                'status' => 'Completed',
            ],
            [
                'item' => 'Final project handover page and PDF completed',
                'status' => 'Completed',
            ],
            [
                'item' => 'Master final submission dashboard completed',
                'status' => 'Completed',
            ],
            [
                'item' => 'Master final submission PDF completed',
                'status' => 'Completed',
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
                'description' => 'Open System Report PDF, Testing Documentation PDF, Project Handover PDF, and Master Final Submission PDF.',
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
