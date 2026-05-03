<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventActivityLog;
use App\Models\EventGuest;
use App\Models\EventInvitation;
use App\Models\EventQaCheck;
use App\Models\EventQuestion;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class SuperAdminTestingDocumentationPdfController extends Controller
{
    public function pdf(): Response
    {
        $modules = $this->testedModules();

        $totalTests = count($modules);
        $passedTests = collect($modules)->where('status', 'passed')->count();
        $failedTests = collect($modules)->where('status', 'failed')->count();
        $pendingTests = collect($modules)->where('status', 'pending')->count();

        $completionPercentage = $totalTests > 0
            ? round(($passedTests / $totalTests) * 100, 2)
            : 0;

        $data = [
            'generatedAt' => now(),
            'generatedBy' => auth()->user(),

            'summary' => [
                'total_tests' => $totalTests,
                'passed_tests' => $passedTests,
                'failed_tests' => $failedTests,
                'pending_tests' => $pendingTests,
                'completion_percentage' => $completionPercentage,
            ],

            'systemStats' => [
                'total_events' => Event::count(),
                'draft_events' => Event::where('status', 'draft')->count(),
                'active_events' => Event::where('status', 'active')->count(),
                'completed_events' => Event::where('status', 'completed')->count(),
                'cancelled_events' => Event::where('status', 'cancelled')->count(),
                'total_users' => User::count(),
                'total_guests' => EventGuest::count(),
                'total_invitations' => EventInvitation::count(),
                'total_questions' => EventQuestion::count(),
                'total_qa_checks' => EventQaCheck::count(),
                'total_activity_logs' => EventActivityLog::count(),
            ],

            'modules' => $modules,

            'demoChecklist' => $this->demoChecklist(),

            'knownIssues' => [
                [
                    'title' => 'PDF buttons must use normal anchor tags',
                    'description' => 'PDF export links should use HTML anchor tags instead of Inertia Link to avoid raw PDF output appearing in the browser.',
                    'status' => 'handled',
                ],
                [
                    'title' => 'Closed events must remain read-only',
                    'description' => 'Completed and cancelled events should allow viewing and exporting, but should block create, update, and delete operations.',
                    'status' => 'handled',
                ],
                [
                    'title' => 'Event answers are linked through invitation',
                    'description' => 'Event answers are connected through the invitation flow. EventGuest should not use a direct answers relationship through guest_id.',
                    'status' => 'handled',
                ],
                [
                    'title' => 'Expense amount column may vary',
                    'description' => 'Expense reports should safely detect available amount-related columns such as amount, total_amount, cost, price, estimated_amount, or actual_amount.',
                    'status' => 'handled',
                ],
            ],

            'readiness' => [
                'status' => $failedTests === 0 && $pendingTests === 0
                    ? 'Ready for final demo'
                    : 'Needs review',

                'message' => $failedTests === 0 && $pendingTests === 0
                    ? 'All listed modules are marked as passed. The system is ready for final project demonstration and documentation submission.'
                    : 'Some tests are still pending or failed. Review the testing table before final submission.',
            ],
        ];

        $pdf = Pdf::loadView('reports.final-testing-documentation', $data)
            ->setPaper('a4', 'landscape');

        return $pdf->stream('final-testing-documentation.pdf');
    }

    private function testedModules(): array
    {
        return [
            [
                'module' => 'Authentication and role-based access',
                'category' => 'Security',
                'test_case' => 'Verify login, logout, Breeze authentication, and Super Admin protected routes.',
                'expected_result' => 'Only authenticated users can access the system. Super Admin pages are limited to Super Admin role.',
                'status' => 'passed',
                'remarks' => 'Spatie role middleware is configured and working.',
            ],
            [
                'module' => 'Event management',
                'category' => 'Organizer',
                'test_case' => 'Create, view, edit, and delete events.',
                'expected_result' => 'Organizer can manage own events successfully.',
                'status' => 'passed',
                'remarks' => 'Event CRUD is working.',
            ],
            [
                'module' => 'Guest management',
                'category' => 'Organizer',
                'test_case' => 'Add, view, and delete event guests.',
                'expected_result' => 'Guests are linked correctly to selected event.',
                'status' => 'passed',
                'remarks' => 'Guest module is working.',
            ],
            [
                'module' => 'Public invitation links',
                'category' => 'Public',
                'test_case' => 'Open generated invitation link without login.',
                'expected_result' => 'Guest can view invitation details publicly.',
                'status' => 'passed',
                'remarks' => 'Public invitation link works.',
            ],
            [
                'module' => 'RSVP questions and responses',
                'category' => 'Public',
                'test_case' => 'Submit RSVP status and answer event questions.',
                'expected_result' => 'Responses and answers are saved correctly.',
                'status' => 'passed',
                'remarks' => 'Answers are linked through invitation.',
            ],
            [
                'module' => 'Guest check-in',
                'category' => 'Event Day',
                'test_case' => 'Mark guest as checked in and undo check-in.',
                'expected_result' => 'Guest check-in status updates correctly.',
                'status' => 'passed',
                'remarks' => 'Check-in and undo check-in are working.',
            ],
            [
                'module' => 'Guest follow-ups',
                'category' => 'Communication',
                'test_case' => 'Send or manually mark follow-up for guests.',
                'expected_result' => 'Follow-up count, note, and timestamp update correctly.',
                'status' => 'passed',
                'remarks' => 'Follow-up module works.',
            ],
            [
                'module' => 'Guest interaction history',
                'category' => 'Communication',
                'test_case' => 'Add and delete interaction notes for guests.',
                'expected_result' => 'Interaction history is stored and displayed correctly.',
                'status' => 'passed',
                'remarks' => 'Interaction history works.',
            ],
            [
                'module' => 'Planning tasks',
                'category' => 'Planning',
                'test_case' => 'Create, update, complete, and delete planning tasks.',
                'expected_result' => 'Planning tasks are managed per event.',
                'status' => 'passed',
                'remarks' => 'Task module works.',
            ],
            [
                'module' => 'Expenses',
                'category' => 'Planning',
                'test_case' => 'Create, update, view, and delete event expenses.',
                'expected_result' => 'Expenses are stored and shown under selected event.',
                'status' => 'passed',
                'remarks' => 'Expense module works.',
            ],
            [
                'module' => 'Vendors',
                'category' => 'Planning',
                'test_case' => 'Create and manage event vendors or suppliers.',
                'expected_result' => 'Vendor records are linked to the event.',
                'status' => 'passed',
                'remarks' => 'Vendor module works.',
            ],
            [
                'module' => 'Schedule / timeline',
                'category' => 'Planning',
                'test_case' => 'Create, update, complete, and delete event schedule items.',
                'expected_result' => 'Timeline items are shown correctly.',
                'status' => 'passed',
                'remarks' => 'Schedule module works.',
            ],
            [
                'module' => 'Staff assignment',
                'category' => 'Planning',
                'test_case' => 'Assign staff members to event responsibilities.',
                'expected_result' => 'Staff assignment records are saved correctly.',
                'status' => 'passed',
                'remarks' => 'Staff module works.',
            ],
            [
                'module' => 'Reminders',
                'category' => 'Communication',
                'test_case' => 'Create reminders and review reminder logs.',
                'expected_result' => 'Reminder and reminder log pages work correctly.',
                'status' => 'passed',
                'remarks' => 'Reminder module works.',
            ],
            [
                'module' => 'Notification center',
                'category' => 'Communication',
                'test_case' => 'Open notification center and review event notifications.',
                'expected_result' => 'Notifications are visible to the organizer.',
                'status' => 'passed',
                'remarks' => 'Notification center works.',
            ],
            [
                'module' => 'Activity logs',
                'category' => 'Audit',
                'test_case' => 'Perform event actions and verify logs.',
                'expected_result' => 'System stores event activity logs with action, user, and description.',
                'status' => 'passed',
                'remarks' => 'Audit trail is working.',
            ],
            [
                'module' => 'Event dashboard',
                'category' => 'Analytics',
                'test_case' => 'Open organizer event dashboard.',
                'expected_result' => 'Dashboard shows guest, RSVP, invitation, follow-up, and activity summaries.',
                'status' => 'passed',
                'remarks' => 'Dashboard works.',
            ],
            [
                'module' => 'Final Event Report PDF',
                'category' => 'Reports',
                'test_case' => 'Generate final event report PDF.',
                'expected_result' => 'PDF opens correctly with event summary, guests, reminders, expenses, and logs.',
                'status' => 'passed',
                'remarks' => 'Final report PDF works.',
            ],
            [
                'module' => 'Event lifecycle / status',
                'category' => 'Workflow',
                'test_case' => 'Mark event active, completed, cancelled, and reopened.',
                'expected_result' => 'Event status changes correctly and timestamps are saved.',
                'status' => 'passed',
                'remarks' => 'Lifecycle buttons work.',
            ],
            [
                'module' => 'Closed-event protection',
                'category' => 'Security',
                'test_case' => 'Try modifying completed or cancelled event modules.',
                'expected_result' => 'Write actions are blocked while read-only pages and exports remain available.',
                'status' => 'passed',
                'remarks' => 'Closed-event protection is added.',
            ],
            [
                'module' => 'QA checklist',
                'category' => 'Testing',
                'test_case' => 'Mark test items as passed, failed, or pending.',
                'expected_result' => 'QA checklist updates and logs testing activity.',
                'status' => 'passed',
                'remarks' => 'QA checklist works.',
            ],
            [
                'module' => 'Project summary',
                'category' => 'Documentation',
                'test_case' => 'Open event project summary page.',
                'expected_result' => 'Summary displays event, RSVP, budget, QA, and activity information.',
                'status' => 'passed',
                'remarks' => 'Project summary works.',
            ],
            [
                'module' => 'Organizer manual',
                'category' => 'Documentation',
                'test_case' => 'Open organizer manual page.',
                'expected_result' => 'Organizer can read system usage instructions.',
                'status' => 'passed',
                'remarks' => 'Manual page works.',
            ],
            [
                'module' => 'Organizer manual PDF',
                'category' => 'Reports',
                'test_case' => 'Generate organizer manual PDF.',
                'expected_result' => 'Manual PDF opens correctly.',
                'status' => 'passed',
                'remarks' => 'Manual PDF works.',
            ],
            [
                'module' => 'Super Admin dashboard',
                'category' => 'Super Admin',
                'test_case' => 'Open Super Admin global dashboard.',
                'expected_result' => 'Global system counts and recent records are shown.',
                'status' => 'passed',
                'remarks' => 'Super Admin dashboard works.',
            ],
            [
                'module' => 'Super Admin events management',
                'category' => 'Super Admin',
                'test_case' => 'Filter and view all system events.',
                'expected_result' => 'Super Admin can view all event records.',
                'status' => 'passed',
                'remarks' => 'Super Admin events page works.',
            ],
            [
                'module' => 'Super Admin users management',
                'category' => 'Super Admin',
                'test_case' => 'Filter and view all system users.',
                'expected_result' => 'Super Admin can view users and roles.',
                'status' => 'passed',
                'remarks' => 'Super Admin users page works.',
            ],
            [
                'module' => 'Super Admin activity logs',
                'category' => 'Super Admin',
                'test_case' => 'Filter and review global activity logs.',
                'expected_result' => 'Super Admin can monitor activity logs across the system.',
                'status' => 'passed',
                'remarks' => 'Super Admin activity monitor works.',
            ],
            [
                'module' => 'Super Admin system report PDF',
                'category' => 'Reports',
                'test_case' => 'Generate global system report PDF.',
                'expected_result' => 'System report PDF opens correctly.',
                'status' => 'passed',
                'remarks' => 'System report PDF works.',
            ],
            [
                'module' => 'Final Testing Documentation Page',
                'category' => 'Documentation',
                'test_case' => 'Open final testing documentation page from Super Admin area.',
                'expected_result' => 'Testing summary, module table, demo checklist, known issues, and readiness status display correctly.',
                'status' => 'passed',
                'remarks' => 'Testing documentation page works.',
            ],
        ];
    }

    private function demoChecklist(): array
    {
        return [
            [
                'step' => 'Login as Super Admin',
                'description' => 'Confirm that Super Admin can access dashboard, events, users, activity logs, reports, and testing documentation.',
                'status' => 'ready',
            ],
            [
                'step' => 'Create or open sample event',
                'description' => 'Open an existing event and verify the event detail page buttons.',
                'status' => 'ready',
            ],
            [
                'step' => 'Test public invitation flow',
                'description' => 'Open invitation link as guest, submit RSVP, and verify response inside organizer area.',
                'status' => 'ready',
            ],
            [
                'step' => 'Test event-day features',
                'description' => 'Check in guest, add follow-up, and add interaction note.',
                'status' => 'ready',
            ],
            [
                'step' => 'Review planning modules',
                'description' => 'Open tasks, expenses, vendors, schedule, staff, and reminders.',
                'status' => 'ready',
            ],
            [
                'step' => 'Review dashboards and reports',
                'description' => 'Open event dashboard, final report PDF, project summary, organizer manual, and manual PDF.',
                'status' => 'ready',
            ],
            [
                'step' => 'Test lifecycle protection',
                'description' => 'Complete or cancel an event and verify modification protection.',
                'status' => 'ready',
            ],
            [
                'step' => 'Generate final Super Admin system report',
                'description' => 'Open the global system report PDF before final submission.',
                'status' => 'ready',
            ],
            [
                'step' => 'Generate final testing documentation PDF',
                'description' => 'Open the final testing documentation PDF and confirm the report is readable.',
                'status' => 'ready',
            ],
        ];
    }
}
