<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class OrganizerManualPdfController extends Controller
{
    public function pdf(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $event->loadMissing([
            'user:id,name,email',
            'completedBy:id,name',
            'cancelledBy:id,name',
        ]);

        $event->loadCount([
            'guests',
            'invitations',
            'questions',
            'tasks',
            'expenses',
            'vendors',
            'schedules',
            'staff',
            'reminders',
            'reminderLogs',
            'activityLogs',
            'qaChecks',
        ]);

        $manualSections = $this->manualSections();

        $pdf = Pdf::loadView('reports.organizer-manual', [
            'event' => $event,
            'organizer' => auth()->user(),
            'manualSections' => $manualSections,
            'generatedAt' => now(),
        ])->setPaper('a4', 'portrait');

        $fileName = 'organizer-manual-event-' . $event->id . '.pdf';

        return $pdf->stream($fileName);
    }

    private function authorizeEventAccess(Event $event): void
    {
        if (auth()->user()?->hasRole('Super Admin')) {
            return;
        }

        abort_if($event->user_id !== auth()->id(), 403);
    }

    private function manualSections(): array
    {
        return [
            [
                'number' => '01',
                'title' => 'System Overview',
                'body' => [
                    'The Smart Event Invitation & Planning System helps organizers create events, generate invitation links, collect RSVP responses, manage guests, track check-ins, follow up with guests, organize planning work, and generate reports.',
                    'Guests do not need to log in. They can open the public invitation link, view the invitation, answer RSVP questions, and submit their response.',
                ],
                'items' => [
                    'Create and manage events.',
                    'Generate public invitation links.',
                    'Collect guest RSVP responses.',
                    'Manage check-ins and follow-ups.',
                    'Track planning tasks, expenses, vendors, schedules, staff, and reminders.',
                    'Generate reports and review activity logs.',
                ],
            ],
            [
                'number' => '02',
                'title' => 'Event Setup',
                'body' => [
                    'The organizer should start by creating the event with accurate details such as title, date, time, venue, event type, contact information, map link, theme color, and dress code.',
                    'Optional fields such as theme color or dress code can be left empty if they are not required.',
                ],
                'items' => [
                    'Confirm the event title.',
                    'Check event date and time.',
                    'Add venue details.',
                    'Add organizer contact details.',
                    'Add map link if directions are needed.',
                    'Review event information before sharing invitations.',
                ],
            ],
            [
                'number' => '03',
                'title' => 'Guest Management',
                'body' => [
                    'Guest records are used for invitation tracking, RSVP summaries, check-ins, follow-ups, and final reports.',
                    'The organizer should add accurate guest names, contact details, guest count, and RSVP status where available.',
                ],
                'items' => [
                    'Add guests with name, phone, email, and guest count.',
                    'Check for duplicate guests before adding new records.',
                    'Update guest information before the event is closed.',
                    'Use guest status to track accepted, declined, and pending responses.',
                    'Avoid modifying guests after the event is completed or cancelled.',
                ],
            ],
            [
                'number' => '04',
                'title' => 'Public Invitation Links',
                'body' => [
                    'The system generates public invitation links for guests. These links can be shared through WhatsApp, SMS, email, or any other communication method.',
                    'This approach is useful when QR scanning is not practical. Guests only need to open the link and submit the response.',
                ],
                'items' => [
                    'Generate invitation links for guests.',
                    'Send the generated link to the correct guest.',
                    'Ask guests to submit their RSVP through the public page.',
                    'Verify submitted responses from the organizer side.',
                ],
            ],
            [
                'number' => '05',
                'title' => 'RSVP Questions and Responses',
                'body' => [
                    'The organizer can create RSVP questions to collect required event information from guests.',
                    'Examples include attendance confirmation, meal preference, number of attendees, transport requirement, or special notes.',
                ],
                'items' => [
                    'Create only necessary RSVP questions.',
                    'Keep questions short and clear.',
                    'Review guest answers after submission.',
                    'Use RSVP summaries to identify accepted, declined, and pending guests.',
                    'Do not connect answers using guest_id if the system stores answers through invitations.',
                ],
            ],
            [
                'number' => '06',
                'title' => 'Guest Check-In',
                'body' => [
                    'During the event, the organizer or staff can mark guests as checked in.',
                    'The system records the check-in time, checked-in user, and optional note.',
                ],
                'items' => [
                    'Open the Guest Check-In page.',
                    'Find the guest from the list.',
                    'Mark the guest as checked in.',
                    'Undo check-in only if it was marked by mistake.',
                    'Export the check-in report if needed.',
                    'Avoid check-in changes after event completion or cancellation.',
                ],
            ],
            [
                'number' => '07',
                'title' => 'Guest Follow-Ups',
                'body' => [
                    'Follow-ups help organizers contact guests who have not responded or need manual confirmation.',
                    'The system can track follow-up time, follow-up user, follow-up note, and follow-up count.',
                ],
                'items' => [
                    'View guests who need follow-up.',
                    'Send or manually mark follow-ups.',
                    'Use bulk follow-up actions where appropriate.',
                    'Add follow-up notes for tracking.',
                    'Export follow-up reports if required.',
                ],
            ],
            [
                'number' => '08',
                'title' => 'Planning Tasks',
                'body' => [
                    'Planning tasks help the organizer track event preparation work.',
                    'Tasks should be used for responsibilities such as venue confirmation, decoration, catering coordination, printing, transport, and communication.',
                ],
                'items' => [
                    'Create planning tasks.',
                    'Assign responsibilities where needed.',
                    'Mark tasks as completed after finishing.',
                    'Review pending tasks before the event date.',
                ],
            ],
            [
                'number' => '09',
                'title' => 'Expenses and Budget',
                'body' => [
                    'The expense module helps the organizer track event costs.',
                    'Expenses can be reviewed in dashboards, project summaries, and reports.',
                ],
                'items' => [
                    'Add expenses with clear descriptions.',
                    'Check the total event cost.',
                    'Review budget values before final reporting.',
                    'Correct wrong expenses before the event is closed.',
                ],
            ],
            [
                'number' => '10',
                'title' => 'Vendors and Suppliers',
                'body' => [
                    'The vendor module stores supplier details related to the event.',
                    'This can include decorators, caterers, photographers, transport providers, hotels, printing services, or other suppliers.',
                ],
                'items' => [
                    'Add vendor name and contact details.',
                    'Record supplier service type.',
                    'Keep important vendor notes.',
                    'Review vendors before the event day.',
                ],
            ],
            [
                'number' => '11',
                'title' => 'Schedule and Timeline',
                'body' => [
                    'The schedule module helps the organizer plan the event timeline.',
                    'It should include important event-day activities, times, responsible persons, and completion status.',
                ],
                'items' => [
                    'Add timeline items in correct order.',
                    'Set planned time for each activity.',
                    'Assign responsible staff if needed.',
                    'Mark schedule items as completed when finished.',
                ],
            ],
            [
                'number' => '12',
                'title' => 'Staff Assignment',
                'body' => [
                    'The staff assignment module helps the organizer assign people to event responsibilities.',
                    'This is useful for check-in, guest handling, stage coordination, supplier coordination, and event supervision.',
                ],
                'items' => [
                    'Add staff members.',
                    'Assign clear roles.',
                    'Confirm responsibilities before event day.',
                    'Update staff details before event closure.',
                ],
            ],
            [
                'number' => '13',
                'title' => 'Reminders and Notifications',
                'body' => [
                    'Reminders help the organizer track important deadlines and actions.',
                    'Reminder logs and notification center items should be reviewed regularly.',
                ],
                'items' => [
                    'Create reminders for important event tasks.',
                    'Review reminder logs.',
                    'Mark reminder logs as reviewed.',
                    'Check the notification center for urgent items.',
                    'Retry failed reminder logs if available.',
                ],
            ],
            [
                'number' => '14',
                'title' => 'Dashboard and Analytics',
                'body' => [
                    'The event dashboard gives the organizer a quick overview of event progress.',
                    'It can be used to review guest counts, RSVP status, check-in progress, follow-up progress, expenses, and other event metrics.',
                ],
                'items' => [
                    'Open the Event Dashboard from the event page.',
                    'Review guest and RSVP totals.',
                    'Check pending guests.',
                    'Review check-in and follow-up progress.',
                    'Use dashboard values before generating final reports.',
                ],
            ],
            [
                'number' => '15',
                'title' => 'Activity Logs and Guest Interaction History',
                'body' => [
                    'Activity logs record important actions in the system.',
                    'Guest interaction history stores guest-specific notes and interactions.',
                ],
                'items' => [
                    'Review activity logs for audit trail.',
                    'Use interaction history for guest-specific notes.',
                    'Check logs before final reporting.',
                    'Use logs as evidence of system usage during demonstrations.',
                ],
            ],
            [
                'number' => '16',
                'title' => 'QA Checklist',
                'body' => [
                    'The QA Checklist is used to test whether important event modules are working correctly.',
                    'Each check can be marked as pending, passed, or failed.',
                ],
                'items' => [
                    'Test event create, edit, and view.',
                    'Test guest add and delete.',
                    'Test public invitation link.',
                    'Test RSVP submission and answers.',
                    'Test guest check-in and undo check-in.',
                    'Test follow-ups.',
                    'Test dashboard, exports, final PDF, and activity logs.',
                    'Mark each test item correctly.',
                ],
            ],
            [
                'number' => '17',
                'title' => 'Final Reports and Project Summary',
                'body' => [
                    'The Final Event Report PDF provides a formal event report.',
                    'The Project Summary page provides a clean project/demo summary including module counts, event summaries, QA progress, and latest activity logs.',
                ],
                'items' => [
                    'Review dashboard before generating reports.',
                    'Complete QA checklist as much as possible.',
                    'Open Project Summary.',
                    'Generate Final Event Report PDF.',
                    'Use reports for demonstration and documentation.',
                ],
            ],
            [
                'number' => '18',
                'title' => 'Event Lifecycle',
                'body' => [
                    'The event lifecycle controls whether an event is editable or closed.',
                    'Draft and active events can be modified. Completed and cancelled events should remain readable but protected from changes.',
                ],
                'items' => [
                    'Draft: event is being prepared.',
                    'Active: event is live and operational.',
                    'Completed: event has finished and should be protected from modification.',
                    'Cancelled: event has been cancelled and should be protected from modification.',
                    'Closed events should still allow viewing, dashboards, exports, reports, activity logs, and QA pages.',
                ],
            ],
            [
                'number' => '19',
                'title' => 'Recommended Organizer Workflow',
                'body' => [
                    'The organizer should follow a structured workflow to reduce mistakes and complete event management properly.',
                ],
                'items' => [
                    'Create event.',
                    'Add guests.',
                    'Create RSVP questions.',
                    'Generate and send invitation links.',
                    'Review RSVP responses.',
                    'Manage tasks, expenses, vendors, schedule, staff, and reminders.',
                    'Use follow-ups for pending guests.',
                    'Use check-in during the event.',
                    'Review dashboard and activity logs.',
                    'Complete QA checklist.',
                    'Generate final reports.',
                    'Mark event as completed.',
                ],
            ],
        ];
    }
}
