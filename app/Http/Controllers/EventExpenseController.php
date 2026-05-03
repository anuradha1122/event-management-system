<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventExpense;
use App\Models\EventVendor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventExpenseController extends Controller
{
    public function index(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $expenses = EventExpense::query()
            ->with('vendor:id,event_id,name,category,phone,email')
            ->where('event_id', $event->id)
            ->orderByDesc('expense_date')
            ->latest()
            ->get();

        $totalEstimated = $expenses->sum('estimated_amount');
        $totalActual = $expenses->sum('actual_amount');
        $totalPaid = $expenses->sum('paid_amount');
        $totalPending = max($totalActual - $totalPaid, 0);
        $balanceDifference = $totalEstimated - $totalActual;

        return Inertia::render('EventExpenses/Index', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'event_date' => $event->event_date,
                'venue' => $event->venue,
                'status' => $event->status,
            ],
            'expenses' => $expenses->map(function (EventExpense $expense) {
                return [
                    'id' => $expense->id,
                    'vendor_id' => $expense->vendor_id,
                    'vendor' => $expense->vendor ? [
                        'id' => $expense->vendor->id,
                        'name' => $expense->vendor->name,
                        'category' => $expense->vendor->category,
                        'phone' => $expense->vendor->phone,
                        'email' => $expense->vendor->email,
                    ] : null,
                    'title' => $expense->title,
                    'category' => $expense->category,
                    'description' => $expense->description,
                    'estimated_amount' => number_format((float) $expense->estimated_amount, 2, '.', ''),
                    'actual_amount' => number_format((float) $expense->actual_amount, 2, '.', ''),
                    'paid_amount' => number_format((float) $expense->paid_amount, 2, '.', ''),
                    'payment_status' => $expense->payment_status,
                    'expense_date' => $expense->expense_date?->format('Y-m-d'),
                    'vendor_name' => $expense->vendor_name,
                    'notes' => $expense->notes,
                ];
            }),
            'summary' => [
                'total_estimated' => number_format((float) $totalEstimated, 2, '.', ''),
                'total_actual' => number_format((float) $totalActual, 2, '.', ''),
                'total_paid' => number_format((float) $totalPaid, 2, '.', ''),
                'total_pending' => number_format((float) $totalPending, 2, '.', ''),
                'balance_difference' => number_format((float) $balanceDifference, 2, '.', ''),
            ],
        ]);
    }

    public function create(Event $event): Response|RedirectResponse
    {
        $this->authorizeEventAccess($event);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        return Inertia::render('EventExpenses/Create', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'status' => $event->status,
            ],
            'categories' => $this->categories(),
            'paymentStatuses' => $this->paymentStatuses(),
            'vendors' => $this->eventVendors($event),
        ]);
    }

    public function store(Request $request, Event $event): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $validated = $request->validate([
            'vendor_id' => ['nullable', 'integer', 'exists:event_vendors,id'],
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:venue,food,decoration,photography,music,transport,printing,gift,other'],
            'description' => ['nullable', 'string'],
            'estimated_amount' => ['nullable', 'numeric', 'min:0'],
            'actual_amount' => ['nullable', 'numeric', 'min:0'],
            'paid_amount' => ['nullable', 'numeric', 'min:0'],
            'payment_status' => ['required', 'in:unpaid,partial,paid'],
            'expense_date' => ['nullable', 'date'],
            'vendor_name' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        $this->ensureVendorBelongsToEventIfSelected($event, $validated['vendor_id'] ?? null);

        $validated['event_id'] = $event->id;
        $validated['estimated_amount'] = $validated['estimated_amount'] ?? 0;
        $validated['actual_amount'] = $validated['actual_amount'] ?? 0;
        $validated['paid_amount'] = $validated['paid_amount'] ?? 0;

        EventExpense::create($validated);

        return redirect()
            ->route('events.expenses.index', $event->id)
            ->with('success', 'Expense created successfully.');
    }

    public function edit(Event $event, EventExpense $expense): Response|RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureExpenseBelongsToEvent($event, $expense);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        return Inertia::render('EventExpenses/Edit', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'status' => $event->status,
            ],
            'expense' => [
                'id' => $expense->id,
                'vendor_id' => $expense->vendor_id,
                'title' => $expense->title,
                'category' => $expense->category,
                'description' => $expense->description,
                'estimated_amount' => number_format((float) $expense->estimated_amount, 2, '.', ''),
                'actual_amount' => number_format((float) $expense->actual_amount, 2, '.', ''),
                'paid_amount' => number_format((float) $expense->paid_amount, 2, '.', ''),
                'payment_status' => $expense->payment_status,
                'expense_date' => $expense->expense_date?->format('Y-m-d'),
                'vendor_name' => $expense->vendor_name,
                'notes' => $expense->notes,
            ],
            'categories' => $this->categories(),
            'paymentStatuses' => $this->paymentStatuses(),
            'vendors' => $this->eventVendors($event),
        ]);
    }

    public function update(Request $request, Event $event, EventExpense $expense): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureExpenseBelongsToEvent($event, $expense);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $validated = $request->validate([
            'vendor_id' => ['nullable', 'integer', 'exists:event_vendors,id'],
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:venue,food,decoration,photography,music,transport,printing,gift,other'],
            'description' => ['nullable', 'string'],
            'estimated_amount' => ['nullable', 'numeric', 'min:0'],
            'actual_amount' => ['nullable', 'numeric', 'min:0'],
            'paid_amount' => ['nullable', 'numeric', 'min:0'],
            'payment_status' => ['required', 'in:unpaid,partial,paid'],
            'expense_date' => ['nullable', 'date'],
            'vendor_name' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        $this->ensureVendorBelongsToEventIfSelected($event, $validated['vendor_id'] ?? null);

        $validated['estimated_amount'] = $validated['estimated_amount'] ?? 0;
        $validated['actual_amount'] = $validated['actual_amount'] ?? 0;
        $validated['paid_amount'] = $validated['paid_amount'] ?? 0;

        $expense->update($validated);

        return redirect()
            ->route('events.expenses.index', $event->id)
            ->with('success', 'Expense updated successfully.');
    }

    public function destroy(Event $event, EventExpense $expense): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureExpenseBelongsToEvent($event, $expense);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $expense->delete();

        return redirect()
            ->route('events.expenses.index', $event->id)
            ->with('success', 'Expense deleted successfully.');
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
                ->route('events.expenses.index', $event)
                ->with('error', 'This event is closed and expenses cannot be modified.');
        }

        return null;
    }

    private function ensureExpenseBelongsToEvent(Event $event, EventExpense $expense): void
    {
        if ((int) $expense->event_id !== (int) $event->id) {
            abort(404);
        }
    }

    private function ensureVendorBelongsToEventIfSelected(Event $event, mixed $vendorId): void
    {
        if (! $vendorId) {
            return;
        }

        $vendorExists = EventVendor::query()
            ->where('id', $vendorId)
            ->where('event_id', $event->id)
            ->exists();

        if (! $vendorExists) {
            abort(404);
        }
    }

    private function eventVendors(Event $event): array
    {
        return EventVendor::query()
            ->where('event_id', $event->id)
            ->orderBy('name')
            ->get(['id', 'name', 'category', 'phone', 'email'])
            ->map(function (EventVendor $vendor) {
                return [
                    'id' => $vendor->id,
                    'name' => $vendor->name,
                    'category' => $vendor->category,
                    'phone' => $vendor->phone,
                    'email' => $vendor->email,
                ];
            })
            ->toArray();
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

    private function paymentStatuses(): array
    {
        return [
            ['value' => 'unpaid', 'label' => 'Unpaid'],
            ['value' => 'partial', 'label' => 'Partial'],
            ['value' => 'paid', 'label' => 'Paid'],
        ];
    }
}
