<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventGuest;
use App\Models\EventGuestInteraction;
use App\Services\EventActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventGuestInteractionController extends Controller
{
    public function index(Request $request, Event $event, EventGuest $guest): Response
    {
        $this->authorizeEventAccess($event);
        $this->ensureGuestBelongsToEvent($event, $guest);

        $type = $request->input('type');
        $channel = $request->input('channel');
        $search = $request->input('search');

        $interactions = EventGuestInteraction::query()
            ->with(['user:id,name'])
            ->where('event_id', $event->id)
            ->where('guest_id', $guest->id)
            ->when($type, function ($query) use ($type) {
                $query->where('type', $type);
            })
            ->when($channel, function ($query) use ($channel) {
                $query->where('channel', $channel);
            })
            ->when($search, function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('message', 'like', "%{$search}%")
                        ->orWhere('note', 'like', "%{$search}%");
                });
            })
            ->latest('interaction_at')
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(function (EventGuestInteraction $interaction) {
                return [
                    'id' => $interaction->id,
                    'type' => $interaction->type,
                    'channel' => $interaction->channel,
                    'title' => $interaction->title,
                    'message' => $interaction->message,
                    'note' => $interaction->note,
                    'interaction_at' => optional($interaction->interaction_at)->format('Y-m-d H:i'),
                    'created_at' => optional($interaction->created_at)->format('Y-m-d H:i'),
                    'user' => $interaction->user
                        ? [
                            'id' => $interaction->user->id,
                            'name' => $interaction->user->name,
                        ]
                        : null,
                ];
            });

        return Inertia::render('EventGuestInteractions/Index', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'event_date' => $event->event_date,
                'event_time' => $event->event_time,
                'venue' => $event->venue,
                'status' => $event->status,
            ],

            'guest' => [
                'id' => $guest->id,
                'name' => $guest->name,
                'email' => $guest->email,
                'phone' => $guest->phone,
                'status' => $guest->status,
                'guest_count' => $guest->guest_count,
                'followup_sent_at' => optional($guest->followup_sent_at)->format('Y-m-d H:i'),
                'followup_count' => $guest->followup_count,
                'followup_note' => $guest->followup_note,
                'checked_in_at' => optional($guest->checked_in_at)->format('Y-m-d H:i'),
            ],

            'interactions' => $interactions,

            'summary' => [
                'total' => EventGuestInteraction::where('event_id', $event->id)
                    ->where('guest_id', $guest->id)
                    ->count(),

                'notes' => EventGuestInteraction::where('event_id', $event->id)
                    ->where('guest_id', $guest->id)
                    ->where('type', 'note')
                    ->count(),

                'followups' => EventGuestInteraction::where('event_id', $event->id)
                    ->where('guest_id', $guest->id)
                    ->where('type', 'followup')
                    ->count(),

                'emails' => EventGuestInteraction::where('event_id', $event->id)
                    ->where('guest_id', $guest->id)
                    ->where('channel', 'email')
                    ->count(),

                'manual' => EventGuestInteraction::where('event_id', $event->id)
                    ->where('guest_id', $guest->id)
                    ->where('channel', 'manual')
                    ->count(),
            ],

            'filters' => [
                'type' => $type,
                'channel' => $channel,
                'search' => $search,
            ],

            'filterOptions' => [
                'types' => [
                    '' => 'All Types',
                    'note' => 'Notes',
                    'followup' => 'Follow-Ups',
                    'checkin' => 'Check-In',
                    'system' => 'System',
                ],

                'channels' => [
                    '' => 'All Channels',
                    'manual' => 'Manual',
                    'email' => 'Email',
                    'whatsapp' => 'WhatsApp',
                    'system' => 'System',
                ],
            ],
        ]);
    }

    public function store(Request $request, Event $event, EventGuest $guest): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureGuestBelongsToEvent($event, $guest);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'note' => ['required', 'string', 'max:3000'],
            'channel' => ['nullable', 'string', 'max:50'],
        ]);

        $interaction = EventGuestInteraction::create([
            'event_id' => $event->id,
            'guest_id' => $guest->id,
            'user_id' => auth()->id(),
            'type' => 'note',
            'channel' => $validated['channel'] ?: 'manual',
            'title' => $validated['title'] ?: 'Manual Note',
            'message' => null,
            'note' => $validated['note'],
            'interaction_at' => now(),
        ]);

        EventActivityLogger::record(
            event: $event,
            action: 'interaction_note_added',
            description: "Interaction note added for guest {$guest->name}.",
            subject: $interaction,
            properties: [
                'guest_id' => $guest->id,
                'guest_name' => $guest->name,
                'guest_email' => $guest->email,
                'guest_phone' => $guest->phone,
                'interaction_id' => $interaction->id,
                'type' => $interaction->type,
                'channel' => $interaction->channel,
                'title' => $interaction->title,
                'note' => $interaction->note,
            ]
        );

        return back()->with('success', 'Guest interaction note added.');
    }

    public function destroy(Event $event, EventGuest $guest, EventGuestInteraction $interaction): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureGuestBelongsToEvent($event, $guest);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        if ((int) $interaction->event_id !== (int) $event->id) {
            abort(404);
        }

        if ((int) $interaction->guest_id !== (int) $guest->id) {
            abort(404);
        }

        $logProperties = [
            'guest_id' => $guest->id,
            'guest_name' => $guest->name,
            'guest_email' => $guest->email,
            'guest_phone' => $guest->phone,
            'interaction_id' => $interaction->id,
            'type' => $interaction->type,
            'channel' => $interaction->channel,
            'title' => $interaction->title,
            'message' => $interaction->message,
            'note' => $interaction->note,
            'interaction_at' => optional($interaction->interaction_at)->format('Y-m-d H:i:s'),
        ];

        $interaction->delete();

        EventActivityLogger::record(
            event: $event,
            action: 'interaction_note_deleted',
            description: "Interaction note deleted for guest {$guest->name}.",
            subject: $guest,
            properties: $logProperties
        );

        return back()->with('success', 'Interaction deleted.');
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
                ->route('events.guests.interactions.index', [
                    'event' => $event->id,
                    'guest' => request()->route('guest')?->id ?? request()->route('guest'),
                ])
                ->with('error', 'This event is closed and guest interactions cannot be modified.');
        }

        return null;
    }

    private function ensureGuestBelongsToEvent(Event $event, EventGuest $guest): void
    {
        if ((int) $guest->event_id !== (int) $event->id) {
            abort(404);
        }
    }
}
