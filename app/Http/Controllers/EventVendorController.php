<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventVendor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventVendorController extends Controller
{
    public function index(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $vendors = EventVendor::query()
            ->where('event_id', $event->id)
            ->orderByRaw("
                CASE status
                    WHEN 'confirmed' THEN 1
                    WHEN 'pending' THEN 2
                    WHEN 'cancelled' THEN 3
                    ELSE 4
                END
            ")
            ->orderBy('category')
            ->orderBy('name')
            ->get();

        $totalVendors = $vendors->count();
        $pendingVendors = $vendors->where('status', 'pending')->count();
        $confirmedVendors = $vendors->where('status', 'confirmed')->count();
        $cancelledVendors = $vendors->where('status', 'cancelled')->count();

        return Inertia::render('EventVendors/Index', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'event_date' => $event->event_date,
                'venue' => $event->venue,
            ],
            'vendors' => $vendors->map(function (EventVendor $vendor) {
                return [
                    'id' => $vendor->id,
                    'name' => $vendor->name,
                    'category' => $vendor->category,
                    'contact_person' => $vendor->contact_person,
                    'phone' => $vendor->phone,
                    'email' => $vendor->email,
                    'address' => $vendor->address,
                    'notes' => $vendor->notes,
                    'status' => $vendor->status,
                ];
            }),
            'summary' => [
                'total' => $totalVendors,
                'pending' => $pendingVendors,
                'confirmed' => $confirmedVendors,
                'cancelled' => $cancelledVendors,
            ],
        ]);
    }

    public function create(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        return Inertia::render('EventVendors/Create', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
            ],
            'categories' => $this->categories(),
            'statuses' => $this->statuses(),
        ]);
    }

    public function store(Request $request, Event $event): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:venue,food,decoration,photography,music,transport,printing,gift,other'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,confirmed,cancelled'],
        ]);

        $validated['event_id'] = $event->id;

        EventVendor::create($validated);

        return redirect()
            ->route('events.vendors.index', $event->id)
            ->with('success', 'Vendor created successfully.');
    }

    public function edit(Event $event, EventVendor $vendor): Response
    {
        $this->authorizeEventAccess($event);
        $this->ensureVendorBelongsToEvent($event, $vendor);

        return Inertia::render('EventVendors/Edit', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
            ],
            'vendor' => [
                'id' => $vendor->id,
                'name' => $vendor->name,
                'category' => $vendor->category,
                'contact_person' => $vendor->contact_person,
                'phone' => $vendor->phone,
                'email' => $vendor->email,
                'address' => $vendor->address,
                'notes' => $vendor->notes,
                'status' => $vendor->status,
            ],
            'categories' => $this->categories(),
            'statuses' => $this->statuses(),
        ]);
    }

    public function update(Request $request, Event $event, EventVendor $vendor): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureVendorBelongsToEvent($event, $vendor);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:venue,food,decoration,photography,music,transport,printing,gift,other'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,confirmed,cancelled'],
        ]);

        $vendor->update($validated);

        return redirect()
            ->route('events.vendors.index', $event->id)
            ->with('success', 'Vendor updated successfully.');
    }

    public function destroy(Event $event, EventVendor $vendor): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureVendorBelongsToEvent($event, $vendor);

        $vendor->delete();

        return redirect()
            ->route('events.vendors.index', $event->id)
            ->with('success', 'Vendor deleted successfully.');
    }

    private function authorizeEventAccess(Event $event): void
    {
        $user = auth()->user();

        if ($user->hasRole('Super Admin')) {
            return;
        }

        if ((int) $event->user_id !== (int) $user->id) {
            abort(403);
        }
    }

    private function ensureVendorBelongsToEvent(Event $event, EventVendor $vendor): void
    {
        if ((int) $vendor->event_id !== (int) $event->id) {
            abort(404);
        }
    }

    private function categories(): array
    {
        return [
            ['value' => 'venue', 'label' => 'Venue'],
            ['value' => 'food', 'label' => 'Food / Catering'],
            ['value' => 'decoration', 'label' => 'Decoration'],
            ['value' => 'photography', 'label' => 'Photography'],
            ['value' => 'music', 'label' => 'Music / DJ'],
            ['value' => 'transport', 'label' => 'Transport'],
            ['value' => 'printing', 'label' => 'Printing'],
            ['value' => 'gift', 'label' => 'Gift Items'],
            ['value' => 'other', 'label' => 'Other'],
        ];
    }

    private function statuses(): array
    {
        return [
            ['value' => 'pending', 'label' => 'Pending'],
            ['value' => 'confirmed', 'label' => 'Confirmed'],
            ['value' => 'cancelled', 'label' => 'Cancelled'],
        ];
    }
}
