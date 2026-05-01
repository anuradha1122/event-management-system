<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventGuest;
use App\Models\EventInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EventGuestImportController extends Controller
{
    public function create(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        return Inertia::render('Guests/Import', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'event_date' => $event->event_date,
            ],
        ]);
    }

    public function store(Request $request, Event $event): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        $request->validate([
            'csv_file' => ['required', 'file', 'mimes:csv,txt', 'max:2048'],
        ]);

        $file = $request->file('csv_file');

        $handle = fopen($file->getRealPath(), 'r');

        if (! $handle) {
            return back()->withErrors([
                'csv_file' => 'Could not read the uploaded CSV file.',
            ]);
        }

        $header = fgetcsv($handle);

        if (! $header) {
            fclose($handle);

            return back()->withErrors([
                'csv_file' => 'CSV file is empty.',
            ]);
        }

        $header = array_map(function ($column) {
            return strtolower(trim($column));
        }, $header);

        $requiredColumns = ['name', 'email', 'phone', 'guest_count'];

        foreach ($requiredColumns as $column) {
            if (! in_array($column, $header)) {
                fclose($handle);

                return back()->withErrors([
                    'csv_file' => "Missing required column: {$column}",
                ]);
            }
        }

        $importedCount = 0;
        $skippedCount = 0;
        $rowNumber = 1;

        DB::transaction(function () use (
            $handle,
            $header,
            $event,
            &$importedCount,
            &$skippedCount,
            &$rowNumber
        ) {
            while (($row = fgetcsv($handle)) !== false) {
                $rowNumber++;

                if ($this->isEmptyRow($row)) {
                    $skippedCount++;
                    continue;
                }

                $data = array_combine($header, $row);

                if (! $data) {
                    $skippedCount++;
                    continue;
                }

                $name = trim($data['name'] ?? '');
                $email = trim($data['email'] ?? '');
                $phone = trim($data['phone'] ?? '');
                $guestCount = trim($data['guest_count'] ?? '');

                if ($name === '') {
                    $skippedCount++;
                    continue;
                }

                $guestCount = is_numeric($guestCount) && (int) $guestCount > 0
                    ? (int) $guestCount
                    : 1;

                $guest = EventGuest::create([
                    'event_id' => $event->id,
                    'name' => $name,
                    'email' => $email ?: null,
                    'phone' => $phone ?: null,
                    'guest_count' => $guestCount,
                ]);

                EventInvitation::create([
                    'event_id' => $event->id,
                    'guest_id' => $guest->id,
                    'token' => Str::uuid()->toString(),
                ]);

                $importedCount++;
            }
        });

        fclose($handle);

        return redirect()
            ->route('events.guests.index', $event)
            ->with('success', "{$importedCount} guests imported successfully. {$skippedCount} rows skipped.");
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

    private function isEmptyRow(array $row): bool
    {
        foreach ($row as $value) {
            if (trim((string) $value) !== '') {
                return false;
            }
        }

        return true;
    }
}
