<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Str;

class EventResponseExportController extends Controller
{
    public function csv(Event $event): StreamedResponse
    {
        $this->authorizeEventAccess($event);

        $event->load([
            'questions:id,event_id,question,type,options,is_required',
            'guests' => function ($query) {
                $query->with([
                    'invitation:id,event_id,guest_id,token,responded_at',
                    'invitation.answers:id,invitation_id,question_id,answer',
                ])->latest();
            },
        ]);

        $filename = Str::slug($event->title) . '-responses.csv';

        $headers = [
            'Guest Name',
            'Email',
            'Phone',
            'Status',
            'Extra Guest Count',
            'Responded At',
        ];

        foreach ($event->questions as $question) {
            $headers[] = $question->question;
        }

        $rows = [];

        $rows[] = $headers;

        foreach ($event->guests as $guest) {
            $answers = $guest->invitation?->answers
                ? $guest->invitation->answers->pluck('answer', 'question_id')
                : collect();

            $row = [
                $guest->name,
                $guest->email ?? '',
                $guest->phone ?? '',
                $guest->status,
                $guest->guest_count,
                optional($guest->invitation?->responded_at)->format('Y-m-d H:i:s') ?? '',
            ];

            foreach ($event->questions as $question) {
                $row[] = $answers[$question->id] ?? '';
            }

            $rows[] = $row;
        }

        $callback = function () use ($rows) {
            $file = fopen('php://output', 'w');

            // UTF-8 BOM so Excel opens Sinhala/Unicode text properly.
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            foreach ($rows as $row) {
                fputcsv($file, $row);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    private function authorizeEventAccess(Event $event): void
    {
        $user = auth()->user();

        if ($user->hasRole('Super Admin')) {
            return;
        }

        abort_unless($event->user_id === $user->id, 403);
    }
}
