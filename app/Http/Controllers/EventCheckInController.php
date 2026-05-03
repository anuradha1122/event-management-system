<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventGuest;
use App\Services\EventActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class EventCheckInController extends Controller
{
    public function index(Request $request, Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $search = $request->input('search');
        $status = $request->input('status');
        $checkinStatus = $request->input('checkin_status');

        $guestQuery = EventGuest::query()
            ->with([
                'invitation:id,event_id,guest_id,token,responded_at,sent_at',
                'checkedInBy:id,name',
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
            ->when($checkinStatus === 'checked_in', function ($query) {
                $query->whereNotNull('checked_in_at');
            })
            ->when($checkinStatus === 'not_checked_in', function ($query) {
                $query->whereNull('checked_in_at');
            })
            ->latest();

        $guests = $guestQuery
            ->paginate(15)
            ->withQueryString()
            ->through(function (EventGuest $guest) {
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
                    'checkin_note' => $guest->checkin_note,
                    'invitation' => $guest->invitation
                        ? [
                            'id' => $guest->invitation->id,
                            'token' => $guest->invitation->token,
                            'responded_at' => optional($guest->invitation->responded_at)->format('Y-m-d H:i'),
                            'sent_at' => optional($guest->invitation->sent_at)->format('Y-m-d H:i'),
                        ]
                        : null,
                ];
            });

        $summary = $this->buildSummary($event);

        return Inertia::render('EventCheckIn/Index', [
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
                'checkin_status' => $checkinStatus,
            ],

            'filterOptions' => [
                'statuses' => [
                    '' => 'All RSVP Statuses',
                    'accepted' => 'Accepted',
                    'declined' => 'Declined',
                    'pending' => 'Pending',
                ],

                'checkinStatuses' => [
                    '' => 'All Check-In Statuses',
                    'checked_in' => 'Checked In',
                    'not_checked_in' => 'Not Checked In',
                ],
            ],
        ]);
    }

    public function checkIn(Request $request, Event $event, EventGuest $guest): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureGuestBelongsToEvent($event, $guest);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $validated = $request->validate([
            'checkin_note' => ['nullable', 'string', 'max:1000'],
        ]);

        if ($guest->checked_in_at) {
            return back()->with('success', 'Guest is already checked in.');
        }

        $guest->update([
            'checked_in_at' => now(),
            'checked_in_by' => auth()->id(),
            'checkin_note' => $validated['checkin_note'] ?? null,
        ]);

        $guest->refresh();

        EventActivityLogger::record(
            event: $event,
            action: 'guest_checked_in',
            description: "Guest {$guest->name} checked in.",
            subject: $guest,
            properties: [
                'guest_id' => $guest->id,
                'guest_name' => $guest->name,
                'guest_email' => $guest->email,
                'guest_phone' => $guest->phone,
                'guest_count' => $guest->guest_count,
                'rsvp_status' => $guest->status,
                'checked_in_at' => optional($guest->checked_in_at)->format('Y-m-d H:i:s'),
                'checked_in_by' => $guest->checked_in_by,
                'checkin_note' => $guest->checkin_note,
            ]
        );

        return back()->with('success', 'Guest checked in successfully.');
    }

    public function undoCheckIn(Event $event, EventGuest $guest): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureGuestBelongsToEvent($event, $guest);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        if (! $guest->checked_in_at) {
            return back()->with('success', 'Guest is not checked in.');
        }

        $oldCheckin = [
            'checked_in_at' => optional($guest->checked_in_at)->format('Y-m-d H:i:s'),
            'checked_in_by' => $guest->checked_in_by,
            'checkin_note' => $guest->checkin_note,
        ];

        $guest->update([
            'checked_in_at' => null,
            'checked_in_by' => null,
            'checkin_note' => null,
        ]);

        EventActivityLogger::record(
            event: $event,
            action: 'guest_checkin_undone',
            description: "Guest {$guest->name} check-in was undone.",
            subject: $guest,
            properties: [
                'guest_id' => $guest->id,
                'guest_name' => $guest->name,
                'guest_email' => $guest->email,
                'guest_phone' => $guest->phone,
                'guest_count' => $guest->guest_count,
                'rsvp_status' => $guest->status,
                'previous_checkin' => $oldCheckin,
            ]
        );

        return back()->with('success', 'Guest check-in removed.');
    }

    public function export(Request $request, Event $event): StreamedResponse
    {
        $this->authorizeEventAccess($event);

        $type = $request->input('type', 'all');
        $search = $request->input('search');
        $status = $request->input('status');
        $checkinStatus = $request->input('checkin_status');

        if (! in_array($type, ['all', 'checked_in', 'not_checked_in'], true)) {
            $type = 'all';
        }

        EventActivityLogger::record(
            event: $event,
            action: 'check_in_report_exported',
            description: $this->formatExportType($type) . ' exported.',
            subject: $event,
            properties: [
                'type' => $type,
                'report_type' => $this->formatExportType($type),
                'filters' => [
                    'search' => $search,
                    'status' => $status,
                    'checkin_status' => $checkinStatus,
                ],
            ]
        );

        $query = EventGuest::query()
            ->with([
                'invitation:id,event_id,guest_id,token,responded_at,sent_at',
                'checkedInBy:id,name',
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
            ->when($checkinStatus === 'checked_in', function ($query) {
                $query->whereNotNull('checked_in_at');
            })
            ->when($checkinStatus === 'not_checked_in', function ($query) {
                $query->whereNull('checked_in_at');
            })
            ->when($type === 'checked_in', function ($query) {
                $query->whereNotNull('checked_in_at');
            })
            ->when($type === 'not_checked_in', function ($query) {
                $query->whereNull('checked_in_at');
            })
            ->orderBy('name');

        $fileLabel = match ($type) {
            'checked_in' => 'checked-in-guests',
            'not_checked_in' => 'not-arrived-guests',
            default => 'attendance-report',
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
            ]);

            fputcsv($handle, [
                $event->id,
                $event->title,
                $event->event_date,
                $event->event_time,
                $event->venue,
                $this->formatExportType($type),
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
                'Check-In Note',
            ]);

            $query->chunk(200, function ($guests) use ($handle) {
                foreach ($guests as $guest) {
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
                        $guest->checkin_note,
                    ]);
                }
            });

            fclose($handle);
        }, $fileName, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
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

        $checkedIn = EventGuest::query()
            ->where('event_id', $event->id)
            ->whereNotNull('checked_in_at')
            ->count();

        $notCheckedIn = EventGuest::query()
            ->where('event_id', $event->id)
            ->whereNull('checked_in_at')
            ->count();

        $expectedAttendingCount = EventGuest::query()
            ->where('event_id', $event->id)
            ->where('status', 'accepted')
            ->sum('guest_count');

        $actualAttendingCount = EventGuest::query()
            ->where('event_id', $event->id)
            ->whereNotNull('checked_in_at')
            ->sum('guest_count');

        $attendancePercentage = $expectedAttendingCount > 0
            ? round(($actualAttendingCount / $expectedAttendingCount) * 100, 2)
            : 0;

        $guestCheckInPercentage = $totalGuests > 0
            ? round(($checkedIn / $totalGuests) * 100, 2)
            : 0;

        return [
            'total_guests' => $totalGuests,
            'accepted' => $accepted,
            'declined' => $declined,
            'pending' => $pending,
            'checked_in' => $checkedIn,
            'not_checked_in' => $notCheckedIn,
            'expected_attending_count' => $expectedAttendingCount,
            'total_attending_count' => $actualAttendingCount,
            'attendance_percentage' => $attendancePercentage,
            'guest_check_in_percentage' => $guestCheckInPercentage,
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

            'checkin' => [
                [
                    'label' => 'Checked In',
                    'value' => $summary['checked_in'],
                    'color' => '#2563eb',
                    'background' => '#dbeafe',
                ],
                [
                    'label' => 'Not Arrived',
                    'value' => $summary['not_checked_in'],
                    'color' => '#4b5563',
                    'background' => '#f3f4f6',
                ],
            ],

            'attendance' => [
                [
                    'label' => 'Expected Attendance',
                    'value' => $summary['expected_attending_count'],
                    'color' => '#7c3aed',
                    'background' => '#ede9fe',
                ],
                [
                    'label' => 'Actual Attendance',
                    'value' => $summary['total_attending_count'],
                    'color' => '#0891b2',
                    'background' => '#cffafe',
                ],
            ],
        ];
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
                ->route('events.check-in.index', $event)
                ->with('error', 'This event is closed and guest check-ins cannot be modified.');
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
            'checked_in' => 'Checked-In Guests',
            'not_checked_in' => 'Not Arrived Guests',
            default => 'Full Attendance Report',
        };
    }
}
