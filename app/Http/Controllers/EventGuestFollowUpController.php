<?php

namespace App\Http\Controllers;

use App\Mail\GuestFollowUpMail;
use App\Models\Event;
use App\Models\EventGuest;
use App\Models\EventGuestInteraction;
use App\Services\EventActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class EventGuestFollowUpController extends Controller
{
    public function index(Request $request, Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $search = $request->input('search');
        $status = $request->input('status');
        $responseStatus = $request->input('response_status');
        $checkinStatus = $request->input('checkin_status');
        $followupStatus = $request->input('followup_status');

        $guestQuery = $this->baseGuestQuery(
            event: $event,
            search: $search,
            status: $status,
            responseStatus: $responseStatus,
            checkinStatus: $checkinStatus,
            followupStatus: $followupStatus
        )->latest();

        $guests = $guestQuery
            ->paginate(15)
            ->withQueryString()
            ->through(function (EventGuest $guest) {
                $inviteUrl = $guest->invitation
                    ? url('/invite/' . $guest->invitation->token)
                    : null;

                return [
                    'id' => $guest->id,
                    'name' => $guest->name,
                    'email' => $guest->email,
                    'phone' => $guest->phone,
                    'guest_count' => $guest->guest_count,
                    'status' => $guest->status,

                    'checked_in_at' => optional($guest->checked_in_at)->format('Y-m-d H:i'),
                    'checked_in_by' => $guest->checkedInBy
                        ? [
                            'id' => $guest->checkedInBy->id,
                            'name' => $guest->checkedInBy->name,
                        ]
                        : null,

                    'followup_sent_at' => optional($guest->followup_sent_at)->format('Y-m-d H:i'),
                    'followup_sent_by' => $guest->followupSentBy
                        ? [
                            'id' => $guest->followupSentBy->id,
                            'name' => $guest->followupSentBy->name,
                        ]
                        : null,

                    'followup_count' => $guest->followup_count,
                    'followup_note' => $guest->followup_note,

                    'invitation' => $guest->invitation
                        ? [
                            'id' => $guest->invitation->id,
                            'token' => $guest->invitation->token,
                            'responded_at' => optional($guest->invitation->responded_at)->format('Y-m-d H:i'),
                            'sent_at' => optional($guest->invitation->sent_at)->format('Y-m-d H:i'),
                            'invite_url' => $inviteUrl,
                        ]
                        : null,

                    'whatsapp_url' => $this->buildWhatsAppUrl($guest, $inviteUrl),
                ];
            });

        $summary = $this->buildSummary($event);

        return Inertia::render('EventGuestFollowUps/Index', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'event_date' => $event->event_date,
                'event_time' => $event->event_time,
                'venue' => $event->venue,
                'status' => $event->status,
            ],

            'guests' => $guests,

            'summary' => $summary,

            'charts' => $this->buildCharts($summary),

            'filters' => [
                'search' => $search,
                'status' => $status,
                'response_status' => $responseStatus,
                'checkin_status' => $checkinStatus,
                'followup_status' => $followupStatus,
            ],

            'filterOptions' => [
                'statuses' => [
                    '' => 'All RSVP Statuses',
                    'accepted' => 'Accepted',
                    'declined' => 'Declined',
                    'pending' => 'Pending',
                ],

                'responseStatuses' => [
                    '' => 'All Response Statuses',
                    'responded' => 'Responded',
                    'not_responded' => 'Not Responded',
                ],

                'checkinStatuses' => [
                    '' => 'All Check-In Statuses',
                    'checked_in' => 'Checked In',
                    'not_checked_in' => 'Not Checked In',
                ],

                'followupStatuses' => [
                    '' => 'All Follow-Up Statuses',
                    'followed_up' => 'Followed Up',
                    'not_followed_up' => 'Not Followed Up',
                ],
            ],
        ]);
    }

    public function send(Request $request, Event $event, EventGuest $guest): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureGuestBelongsToEvent($event, $guest);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $validated = $request->validate([
            'message' => ['nullable', 'string', 'max:2000'],
            'followup_note' => ['nullable', 'string', 'max:1000'],
        ]);

        if (! $guest->email) {
            return back()->with('error', 'This guest does not have an email address.');
        }

        $guest->load('invitation');

        Mail::to($guest->email)->send(
            new GuestFollowUpMail(
                event: $event,
                guest: $guest,
                invitation: $guest->invitation,
                messageText: $validated['message'] ?? null
            )
        );

        $this->markGuestFollowedUp(
            guest: $guest,
            note: $validated['followup_note'] ?? null,
            channel: 'email',
            message: $validated['message'] ?? null
        );

        return back()->with('success', 'Follow-up email sent successfully.');
    }

    public function mark(Request $request, Event $event, EventGuest $guest): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureGuestBelongsToEvent($event, $guest);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $validated = $request->validate([
            'followup_note' => ['nullable', 'string', 'max:1000'],
        ]);

        $this->markGuestFollowedUp(
            guest: $guest,
            note: $validated['followup_note'] ?? null,
            channel: 'manual',
            message: null
        );

        return back()->with('success', 'Guest marked as followed up.');
    }

    public function bulkSend(Request $request, Event $event): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $validated = $request->validate([
            'guest_ids' => ['required', 'array', 'min:1'],
            'guest_ids.*' => ['integer'],
            'message' => ['nullable', 'string', 'max:2000'],
            'followup_note' => ['nullable', 'string', 'max:1000'],
        ]);

        $guests = EventGuest::query()
            ->with('invitation')
            ->where('event_id', $event->id)
            ->whereIn('id', $validated['guest_ids'])
            ->get();

        if ($guests->isEmpty()) {
            return back()->with('error', 'No valid guests selected.');
        }

        $sentCount = 0;
        $skippedCount = 0;
        $failedCount = 0;
        $sentGuestIds = [];
        $skippedGuestIds = [];
        $failedGuestIds = [];

        foreach ($guests as $guest) {
            if (! $guest->email) {
                $skippedCount++;
                $skippedGuestIds[] = $guest->id;
                continue;
            }

            try {
                Mail::to($guest->email)->send(
                    new GuestFollowUpMail(
                        event: $event,
                        guest: $guest,
                        invitation: $guest->invitation,
                        messageText: $validated['message'] ?? null
                    )
                );

                $this->markGuestFollowedUp(
                    guest: $guest,
                    note: $validated['followup_note'] ?? null,
                    channel: 'email',
                    message: $validated['message'] ?? null
                );

                $sentCount++;
                $sentGuestIds[] = $guest->id;
            } catch (\Throwable $exception) {
                report($exception);

                $failedCount++;
                $failedGuestIds[] = $guest->id;
            }
        }

        EventActivityLogger::record(
            event: $event,
            action: 'bulk_followup_email_sent',
            description: "Bulk follow-up email completed. Sent: {$sentCount}, Skipped: {$skippedCount}, Failed: {$failedCount}.",
            subject: $event,
            properties: [
                'selected_guest_ids' => $validated['guest_ids'],
                'sent_count' => $sentCount,
                'skipped_count' => $skippedCount,
                'failed_count' => $failedCount,
                'sent_guest_ids' => $sentGuestIds,
                'skipped_guest_ids' => $skippedGuestIds,
                'failed_guest_ids' => $failedGuestIds,
                'message' => $validated['message'] ?? null,
                'followup_note' => $validated['followup_note'] ?? null,
            ]
        );

        return back()->with(
            'success',
            "Bulk follow-up completed. Sent: {$sentCount}, Skipped no email: {$skippedCount}, Failed: {$failedCount}."
        );
    }

    public function bulkMark(Request $request, Event $event): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $validated = $request->validate([
            'guest_ids' => ['required', 'array', 'min:1'],
            'guest_ids.*' => ['integer'],
            'followup_note' => ['nullable', 'string', 'max:1000'],
        ]);

        $guests = EventGuest::query()
            ->where('event_id', $event->id)
            ->whereIn('id', $validated['guest_ids'])
            ->get();

        if ($guests->isEmpty()) {
            return back()->with('error', 'No valid guests selected.');
        }

        foreach ($guests as $guest) {
            $this->markGuestFollowedUp(
                guest: $guest,
                note: $validated['followup_note'] ?? null,
                channel: 'manual',
                message: null
            );
        }

        EventActivityLogger::record(
            event: $event,
            action: 'bulk_followup_manual_marked',
            description: $guests->count() . ' guests manually marked as followed up.',
            subject: $event,
            properties: [
                'selected_guest_ids' => $validated['guest_ids'],
                'marked_count' => $guests->count(),
                'followup_note' => $validated['followup_note'] ?? null,
            ]
        );

        return back()->with('success', $guests->count() . ' guests marked as followed up.');
    }

    public function export(Request $request, Event $event): StreamedResponse
    {
        $this->authorizeEventAccess($event);

        $type = $request->input('type', 'all');
        $search = $request->input('search');
        $status = $request->input('status');
        $responseStatus = $request->input('response_status');
        $checkinStatus = $request->input('checkin_status');
        $followupStatus = $request->input('followup_status');

        if (! in_array($type, [
            'all',
            'followed_up',
            'not_followed_up',
            'not_responded',
            'not_arrived',
        ], true)) {
            $type = 'all';
        }

        EventActivityLogger::record(
            event: $event,
            action: 'followup_report_exported',
            description: $this->formatExportType($type) . ' exported.',
            subject: $event,
            properties: [
                'type' => $type,
                'report_type' => $this->formatExportType($type),
                'filters' => [
                    'search' => $search,
                    'status' => $status,
                    'response_status' => $responseStatus,
                    'checkin_status' => $checkinStatus,
                    'followup_status' => $followupStatus,
                ],
            ]
        );

        $query = $this->baseGuestQuery(
            event: $event,
            search: $search,
            status: $status,
            responseStatus: $responseStatus,
            checkinStatus: $checkinStatus,
            followupStatus: $followupStatus
        )
            ->when($type === 'followed_up', function ($query) {
                $query->whereNotNull('followup_sent_at');
            })
            ->when($type === 'not_followed_up', function ($query) {
                $query->whereNull('followup_sent_at');
            })
            ->when($type === 'not_responded', function ($query) {
                $query->whereHas('invitation', function ($invitationQuery) {
                    $invitationQuery->whereNull('responded_at');
                });
            })
            ->when($type === 'not_arrived', function ($query) {
                $query->whereNull('checked_in_at');
            })
            ->orderBy('name');

        $fileLabel = match ($type) {
            'followed_up' => 'followed-up-guests',
            'not_followed_up' => 'not-followed-up-guests',
            'not_responded' => 'not-responded-guests',
            'not_arrived' => 'not-arrived-guests',
            default => 'guest-follow-up-report',
        };

        $fileName = $fileLabel . '-event-' . $event->id . '-' . now()->format('Y-m-d-His') . '.csv';

        return response()->streamDownload(function () use ($query, $event, $type) {
            $handle = fopen('php://output', 'w');

            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'Event ID',
                'Event Title',
                'Event Date',
                'Event Time',
                'Venue',
                'Report Type',
                'Generated At',
            ]);

            fputcsv($handle, [
                $event->id,
                $event->title,
                $event->event_date,
                $event->event_time,
                $event->venue,
                $this->formatExportType($type),
                now()->format('Y-m-d H:i:s'),
            ]);

            fputcsv($handle, []);

            fputcsv($handle, [
                'Guest ID',
                'Guest Name',
                'Email',
                'Phone',
                'Guest Count',
                'RSVP Status',
                'Invitation Sent At',
                'Responded At',
                'Check-In Status',
                'Checked In At',
                'Checked In By',
                'Follow-Up Status',
                'Follow-Up Sent At',
                'Follow-Up Sent By',
                'Follow-Up Count',
                'Follow-Up Note',
                'Invitation Link',
            ]);

            $query->chunk(200, function ($guests) use ($handle) {
                foreach ($guests as $guest) {
                    $inviteUrl = $guest->invitation
                        ? url('/invite/' . $guest->invitation->token)
                        : null;

                    fputcsv($handle, [
                        $guest->id,
                        $guest->name,
                        $guest->email,
                        $guest->phone,
                        $guest->guest_count,
                        $guest->status ?: 'pending',
                        optional($guest->invitation?->sent_at)->format('Y-m-d H:i'),
                        optional($guest->invitation?->responded_at)->format('Y-m-d H:i'),
                        $guest->checked_in_at ? 'Checked In' : 'Not Arrived',
                        optional($guest->checked_in_at)->format('Y-m-d H:i'),
                        $guest->checkedInBy?->name,
                        $guest->followup_sent_at ? 'Followed Up' : 'Not Followed Up',
                        optional($guest->followup_sent_at)->format('Y-m-d H:i'),
                        $guest->followupSentBy?->name,
                        $guest->followup_count ?? 0,
                        $guest->followup_note,
                        $inviteUrl,
                    ]);
                }
            });

            fclose($handle);
        }, $fileName, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    private function baseGuestQuery(
        Event $event,
        ?string $search = null,
        ?string $status = null,
        ?string $responseStatus = null,
        ?string $checkinStatus = null,
        ?string $followupStatus = null
    ) {
        return EventGuest::query()
            ->with([
                'invitation:id,event_id,guest_id,token,responded_at,sent_at',
                'checkedInBy:id,name',
                'followupSentBy:id,name',
            ])
            ->where('event_id', $event->id)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->when($responseStatus === 'responded', function ($query) {
                $query->whereHas('invitation', function ($invitationQuery) {
                    $invitationQuery->whereNotNull('responded_at');
                });
            })
            ->when($responseStatus === 'not_responded', function ($query) {
                $query->whereHas('invitation', function ($invitationQuery) {
                    $invitationQuery->whereNull('responded_at');
                });
            })
            ->when($checkinStatus === 'checked_in', function ($query) {
                $query->whereNotNull('checked_in_at');
            })
            ->when($checkinStatus === 'not_checked_in', function ($query) {
                $query->whereNull('checked_in_at');
            })
            ->when($followupStatus === 'followed_up', function ($query) {
                $query->whereNotNull('followup_sent_at');
            })
            ->when($followupStatus === 'not_followed_up', function ($query) {
                $query->whereNull('followup_sent_at');
            });
    }

    private function markGuestFollowedUp(
        EventGuest $guest,
        ?string $note = null,
        string $channel = 'manual',
        ?string $message = null
    ): void {
        $guest->update([
            'followup_sent_at' => now(),
            'followup_sent_by' => auth()->id(),
            'followup_count' => ((int) $guest->followup_count) + 1,
            'followup_note' => $note,
        ]);

        $guest->refresh();

        $interaction = EventGuestInteraction::create([
            'event_id' => $guest->event_id,
            'guest_id' => $guest->id,
            'user_id' => auth()->id(),
            'type' => 'followup',
            'channel' => $channel,
            'title' => match ($channel) {
                'email' => 'Follow-Up Email Sent',
                'whatsapp' => 'WhatsApp Follow-Up',
                default => 'Manual Follow-Up',
            },
            'message' => $message,
            'note' => $note,
            'interaction_at' => now(),
        ]);

        EventActivityLogger::record(
            event: $guest->event,
            action: $channel === 'email'
                ? 'followup_email_sent'
                : 'followup_manual_marked',
            description: $channel === 'email'
                ? "Follow-up email sent to guest {$guest->name}."
                : "Guest {$guest->name} manually marked as followed up.",
            subject: $guest,
            properties: [
                'guest_id' => $guest->id,
                'guest_name' => $guest->name,
                'guest_email' => $guest->email,
                'guest_phone' => $guest->phone,
                'guest_count' => $guest->guest_count,
                'rsvp_status' => $guest->status,
                'channel' => $channel,
                'note' => $note,
                'message' => $message,
                'followup_sent_at' => optional($guest->followup_sent_at)->format('Y-m-d H:i:s'),
                'followup_sent_by' => $guest->followup_sent_by,
                'followup_count' => $guest->followup_count,
                'interaction_id' => $interaction->id,
            ]
        );
    }

    private function buildSummary(Event $event): array
    {
        $totalGuests = EventGuest::query()
            ->where('event_id', $event->id)
            ->count();

        $accepted = EventGuest::query()
            ->where('event_id', $event->id)
            ->where('status', 'accepted')
            ->count();

        $declined = EventGuest::query()
            ->where('event_id', $event->id)
            ->where('status', 'declined')
            ->count();

        $pending = EventGuest::query()
            ->where('event_id', $event->id)
            ->where(function ($query) {
                $query
                    ->whereNull('status')
                    ->orWhere('status', 'pending');
            })
            ->count();

        $responded = EventGuest::query()
            ->where('event_id', $event->id)
            ->whereHas('invitation', function ($query) {
                $query->whereNotNull('responded_at');
            })
            ->count();

        $notResponded = EventGuest::query()
            ->where('event_id', $event->id)
            ->whereHas('invitation', function ($query) {
                $query->whereNull('responded_at');
            })
            ->count();

        $checkedIn = EventGuest::query()
            ->where('event_id', $event->id)
            ->whereNotNull('checked_in_at')
            ->count();

        $notArrived = EventGuest::query()
            ->where('event_id', $event->id)
            ->whereNull('checked_in_at')
            ->count();

        $followedUp = EventGuest::query()
            ->where('event_id', $event->id)
            ->whereNotNull('followup_sent_at')
            ->count();

        $notFollowedUp = EventGuest::query()
            ->where('event_id', $event->id)
            ->whereNull('followup_sent_at')
            ->count();

        $totalFollowupCount = EventGuest::query()
            ->where('event_id', $event->id)
            ->sum('followup_count');

        $guestsWithMultipleFollowups = EventGuest::query()
            ->where('event_id', $event->id)
            ->where('followup_count', '>', 1)
            ->count();

        return [
            'total_guests' => $totalGuests,
            'accepted' => $accepted,
            'declined' => $declined,
            'pending' => $pending,
            'responded' => $responded,
            'not_responded' => $notResponded,
            'checked_in' => $checkedIn,
            'not_arrived' => $notArrived,
            'followed_up' => $followedUp,
            'not_followed_up' => $notFollowedUp,
            'total_followup_count' => $totalFollowupCount,
            'guests_with_multiple_followups' => $guestsWithMultipleFollowups,

            'response_percentage' => $totalGuests > 0
                ? round(($responded / $totalGuests) * 100, 2)
                : 0,

            'arrival_percentage' => $totalGuests > 0
                ? round(($checkedIn / $totalGuests) * 100, 2)
                : 0,

            'followup_percentage' => $totalGuests > 0
                ? round(($followedUp / $totalGuests) * 100, 2)
                : 0,
        ];
    }

    private function buildCharts(array $summary): array
    {
        return [
            'rsvp' => [
                [
                    'label' => 'Accepted',
                    'value' => $summary['accepted'],
                    'color' => '#16a34a',
                    'background' => '#dcfce7',
                ],
                [
                    'label' => 'Declined',
                    'value' => $summary['declined'],
                    'color' => '#dc2626',
                    'background' => '#fee2e2',
                ],
                [
                    'label' => 'Pending',
                    'value' => $summary['pending'],
                    'color' => '#d97706',
                    'background' => '#fef3c7',
                ],
            ],

            'response' => [
                [
                    'label' => 'Responded',
                    'value' => $summary['responded'],
                    'color' => '#2563eb',
                    'background' => '#dbeafe',
                ],
                [
                    'label' => 'Not Responded',
                    'value' => $summary['not_responded'],
                    'color' => '#dc2626',
                    'background' => '#fee2e2',
                ],
            ],

            'checkin' => [
                [
                    'label' => 'Checked In',
                    'value' => $summary['checked_in'],
                    'color' => '#0891b2',
                    'background' => '#cffafe',
                ],
                [
                    'label' => 'Not Arrived',
                    'value' => $summary['not_arrived'],
                    'color' => '#4b5563',
                    'background' => '#f3f4f6',
                ],
            ],

            'followup' => [
                [
                    'label' => 'Followed Up',
                    'value' => $summary['followed_up'],
                    'color' => '#7c3aed',
                    'background' => '#ede9fe',
                ],
                [
                    'label' => 'Not Followed',
                    'value' => $summary['not_followed_up'],
                    'color' => '#ea580c',
                    'background' => '#ffedd5',
                ],
            ],
        ];
    }

    private function buildWhatsAppUrl(EventGuest $guest, ?string $inviteUrl): ?string
    {
        if (! $guest->phone) {
            return null;
        }

        $phone = preg_replace('/[^0-9]/', '', $guest->phone);

        if (! $phone) {
            return null;
        }

        if (str_starts_with($phone, '0')) {
            $phone = '94' . substr($phone, 1);
        }

        $message = 'Hello ' . ($guest->name ?: '') . ', this is a reminder regarding your event invitation.';

        if ($inviteUrl) {
            $message .= ' Please open your invitation here: ' . $inviteUrl;
        }

        return 'https://wa.me/' . $phone . '?text=' . urlencode($message);
    }

    private function authorizeEventAccess(Event $event): void
    {
        $user = auth()->user();

        if (! $user) {
            abort(403);
        }

        if ($user->hasRole('Super Admin')) {
            return;
        }

        if ((int) $event->user_id !== (int) $user->id) {
            abort(403);
        }
    }

    private function preventClosedEventModification(Event $event): ?RedirectResponse
    {
        if (in_array($event->status, ['completed', 'cancelled'], true)) {
            return redirect()
                ->route('events.guest-follow-ups.index', $event)
                ->with('error', 'This event is closed and guest follow-ups cannot be modified.');
        }

        return null;
    }

    private function ensureGuestBelongsToEvent(Event $event, EventGuest $guest): void
    {
        if ((int) $guest->event_id !== (int) $event->id) {
            abort(404);
        }
    }

    private function formatExportType(string $type): string
    {
        return match ($type) {
            'followed_up' => 'Followed-Up Guests',
            'not_followed_up' => 'Not Followed-Up Guests',
            'not_responded' => 'Not Responded Guests',
            'not_arrived' => 'Not Arrived Guests',
            default => 'Full Guest Follow-Up Report',
        };
    }
}
