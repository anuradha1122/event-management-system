<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventQaCheck;
use App\Services\EventActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventQaChecklistController extends Controller
{
    public function index(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $this->ensureDefaultChecksExist($event);

        $checks = EventQaCheck::query()
            ->with('tester:id,name')
            ->where('event_id', $event->id)
            ->orderByRaw("
                CASE category
                    WHEN 'Core Event Flow' THEN 1
                    WHEN 'Guest & Invitation Flow' THEN 2
                    WHEN 'Event Operations' THEN 3
                    WHEN 'Reports & Logs' THEN 4
                    WHEN 'Lifecycle' THEN 5
                    ELSE 6
                END
            ")
            ->orderBy('id')
            ->get();

        $summary = [
            'total' => $checks->count(),
            'pending' => $checks->where('status', 'pending')->count(),
            'passed' => $checks->where('status', 'passed')->count(),
            'failed' => $checks->where('status', 'failed')->count(),
        ];

        $summary['completion_percentage'] = $summary['total'] > 0
            ? round((($summary['passed'] + $summary['failed']) / $summary['total']) * 100)
            : 0;

        $summary['pass_percentage'] = $summary['total'] > 0
            ? round(($summary['passed'] / $summary['total']) * 100)
            : 0;

        return Inertia::render('EventQaChecklist/Index', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'event_date' => $event->event_date,
                'event_time' => $event->event_time,
                'venue' => $event->venue,
                'status' => $event->status,
            ],
            'checks' => $checks->map(function (EventQaCheck $check) {
                return [
                    'id' => $check->id,
                    'check_key' => $check->check_key,
                    'category' => $check->category,
                    'title' => $check->title,
                    'description' => $check->description,
                    'status' => $check->status,
                    'note' => $check->note,
                    'tested_at' => optional($check->tested_at)->format('Y-m-d H:i'),
                    'tester' => $check->tester
                        ? [
                            'id' => $check->tester->id,
                            'name' => $check->tester->name,
                        ]
                        : null,
                ];
            }),
            'summary' => $summary,
            'statusOptions' => [
                ['value' => 'pending', 'label' => 'Pending'],
                ['value' => 'passed', 'label' => 'Passed'],
                ['value' => 'failed', 'label' => 'Failed'],
            ],
        ]);
    }

    public function update(Request $request, Event $event, EventQaCheck $check): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureCheckBelongsToEvent($event, $check);

        $validated = $request->validate([
            'status' => ['required', 'in:pending,passed,failed'],
            'note' => ['nullable', 'string', 'max:3000'],
        ]);

        $oldStatus = $check->status;

        $check->update([
            'status' => $validated['status'],
            'note' => $validated['note'] ?? null,
            'tested_by' => $validated['status'] === 'pending' ? null : auth()->id(),
            'tested_at' => $validated['status'] === 'pending' ? null : now(),
        ]);

        if (class_exists(EventActivityLogger::class)) {
            EventActivityLogger::record(
                event: $event,
                action: 'qa_check_updated',
                description: "QA check {$check->title} marked as {$validated['status']}.",
                subject: $check,
                properties: [
                    'qa_check_id' => $check->id,
                    'check_key' => $check->check_key,
                    'title' => $check->title,
                    'old_status' => $oldStatus,
                    'new_status' => $validated['status'],
                    'note' => $validated['note'] ?? null,
                ]
            );
        }

        return back()->with('success', 'QA check updated successfully.');
    }

    public function reset(Event $event): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        EventQaCheck::query()
            ->where('event_id', $event->id)
            ->update([
                'status' => 'pending',
                'note' => null,
                'tested_by' => null,
                'tested_at' => null,
            ]);

        if (class_exists(EventActivityLogger::class)) {
            EventActivityLogger::record(
                event: $event,
                action: 'qa_checklist_reset',
                description: 'Event QA checklist was reset.',
                subject: $event,
                properties: [
                    'event_id' => $event->id,
                ]
            );
        }

        return back()->with('success', 'QA checklist reset successfully.');
    }

    private function ensureDefaultChecksExist(Event $event): void
    {
        foreach ($this->defaultChecks() as $item) {
            EventQaCheck::firstOrCreate(
                [
                    'event_id' => $event->id,
                    'check_key' => $item['check_key'],
                ],
                [
                    'category' => $item['category'],
                    'title' => $item['title'],
                    'description' => $item['description'],
                    'status' => 'pending',
                ]
            );
        }
    }

    private function defaultChecks(): array
    {
        return [
            [
                'check_key' => 'event_create',
                'category' => 'Core Event Flow',
                'title' => 'Event creation tested',
                'description' => 'Create a new event and confirm it appears in the event list.',
            ],
            [
                'check_key' => 'event_edit',
                'category' => 'Core Event Flow',
                'title' => 'Event edit tested',
                'description' => 'Edit event details and confirm updated details are saved correctly.',
            ],
            [
                'check_key' => 'event_show',
                'category' => 'Core Event Flow',
                'title' => 'Event detail page tested',
                'description' => 'Open event details page and confirm counts, buttons, and event information are visible.',
            ],

            [
                'check_key' => 'guest_add',
                'category' => 'Guest & Invitation Flow',
                'title' => 'Guest creation tested',
                'description' => 'Add a guest and confirm invitation link is generated.',
            ],
            [
                'check_key' => 'guest_delete',
                'category' => 'Guest & Invitation Flow',
                'title' => 'Guest deletion tested',
                'description' => 'Delete a guest and confirm the guest is removed correctly.',
            ],
            [
                'check_key' => 'public_invitation',
                'category' => 'Guest & Invitation Flow',
                'title' => 'Public invitation link tested',
                'description' => 'Open public invitation link without login and confirm invitation page loads.',
            ],
            [
                'check_key' => 'rsvp_submit',
                'category' => 'Guest & Invitation Flow',
                'title' => 'RSVP submission tested',
                'description' => 'Submit RSVP from public invitation page and confirm guest status changes.',
            ],
            [
                'check_key' => 'rsvp_answers',
                'category' => 'Guest & Invitation Flow',
                'title' => 'RSVP answer saving tested',
                'description' => 'Submit RSVP questions and confirm answers are visible to organizer.',
            ],

            [
                'check_key' => 'check_in',
                'category' => 'Event Operations',
                'title' => 'Guest check-in tested',
                'description' => 'Check in a guest and confirm checked-in date/time is saved.',
            ],
            [
                'check_key' => 'check_in_undo',
                'category' => 'Event Operations',
                'title' => 'Undo check-in tested',
                'description' => 'Undo guest check-in and confirm check-in data is cleared.',
            ],
            [
                'check_key' => 'follow_up',
                'category' => 'Event Operations',
                'title' => 'Guest follow-up tested',
                'description' => 'Mark or send guest follow-up and confirm follow-up data is saved.',
            ],
            [
                'check_key' => 'tasks',
                'category' => 'Event Operations',
                'title' => 'Planning tasks tested',
                'description' => 'Create, update, mark done, and delete event planning tasks.',
            ],
            [
                'check_key' => 'expenses',
                'category' => 'Event Operations',
                'title' => 'Budget / expenses tested',
                'description' => 'Create, update, and delete expenses. Confirm summary totals are correct.',
            ],
            [
                'check_key' => 'vendors',
                'category' => 'Event Operations',
                'title' => 'Vendors / suppliers tested',
                'description' => 'Create, update, and delete vendors.',
            ],
            [
                'check_key' => 'schedules',
                'category' => 'Event Operations',
                'title' => 'Schedule / timeline tested',
                'description' => 'Create, update, complete, and delete schedule items.',
            ],
            [
                'check_key' => 'staff',
                'category' => 'Event Operations',
                'title' => 'Staff assignment tested',
                'description' => 'Create, update, and delete staff members.',
            ],
            [
                'check_key' => 'reminders',
                'category' => 'Event Operations',
                'title' => 'Reminders tested',
                'description' => 'Create, update, mark sent, cancel, and delete reminders.',
            ],

            [
                'check_key' => 'dashboard',
                'category' => 'Reports & Logs',
                'title' => 'Event dashboard tested',
                'description' => 'Open event dashboard and confirm analytics summaries are correct.',
            ],
            [
                'check_key' => 'activity_logs',
                'category' => 'Reports & Logs',
                'title' => 'Activity logs tested',
                'description' => 'Open activity logs and confirm system actions are recorded.',
            ],
            [
                'check_key' => 'check_in_export',
                'category' => 'Reports & Logs',
                'title' => 'Check-in export tested',
                'description' => 'Export check-in report and confirm CSV downloads correctly.',
            ],
            [
                'check_key' => 'follow_up_export',
                'category' => 'Reports & Logs',
                'title' => 'Follow-up export tested',
                'description' => 'Export follow-up report and confirm CSV downloads correctly.',
            ],
            [
                'check_key' => 'final_pdf_report',
                'category' => 'Reports & Logs',
                'title' => 'Final PDF report tested',
                'description' => 'Download final event PDF report and confirm PDF opens correctly.',
            ],

            [
                'check_key' => 'mark_active',
                'category' => 'Lifecycle',
                'title' => 'Mark active tested',
                'description' => 'Mark event as active and confirm status changes.',
            ],
            [
                'check_key' => 'complete_event',
                'category' => 'Lifecycle',
                'title' => 'Complete event tested',
                'description' => 'Complete event and confirm closed-event modification protection works.',
            ],
            [
                'check_key' => 'cancel_event',
                'category' => 'Lifecycle',
                'title' => 'Cancel event tested',
                'description' => 'Cancel event and confirm closed-event modification protection works.',
            ],
            [
                'check_key' => 'reopen_event',
                'category' => 'Lifecycle',
                'title' => 'Reopen event tested',
                'description' => 'Reopen completed/cancelled event and confirm modifications are allowed again.',
            ],
        ];
    }

    private function authorizeEventAccess(Event $event): void
    {
        $user = auth()->user();

        abort_unless($user, 403);

        if ($user->hasRole('Super Admin')) {
            return;
        }

        abort_unless((int) $event->user_id === (int) $user->id, 403);
    }

    private function ensureCheckBelongsToEvent(Event $event, EventQaCheck $check): void
    {
        if ((int) $check->event_id !== (int) $event->id) {
            abort(404);
        }
    }
}
