<?php

namespace App\Console\Commands;

use App\Mail\EventReminderDueMail;
use App\Models\EventReminder;
use App\Models\EventReminderLog;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ProcessEventReminders extends Command
{
    protected $signature = 'reminders:process
                            {--dry-run : Show due reminders without updating or emailing them}
                            {--no-mail : Mark reminders as sent without sending emails}';

    protected $description = 'Process due event reminders, send emails, write logs, and mark reminders as sent.';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $noMail = (bool) $this->option('no-mail');

        $this->info('Checking due event reminders...');

        $dueReminders = EventReminder::query()
            ->with([
                'event:id,user_id,title,event_date,event_time,venue',
                'event.user:id,name,email',
                'task:id,event_id,title',
                'schedule:id,event_id,title,schedule_date,start_time',
                'staff:id,event_id,name,email,phone,role',
            ])
            ->where('status', 'pending')
            ->where('remind_at', '<=', now())
            ->orderBy('remind_at')
            ->get();

        if ($dueReminders->isEmpty()) {
            $this->info('No due reminders found.');
            return self::SUCCESS;
        }

        $this->info("Due reminders found: {$dueReminders->count()}");

        $rows = $dueReminders->map(function (EventReminder $reminder) {
            $recipients = $this->getRecipients($reminder);

            return [
                'ID' => $reminder->id,
                'Event' => $reminder->event?->title ?? '-',
                'Title' => $reminder->title,
                'Type' => $reminder->reminder_type,
                'Recipients' => count($recipients),
                'Remind At' => optional($reminder->remind_at)->format('Y-m-d H:i:s'),
            ];
        })->toArray();

        $this->table(
            ['ID', 'Event', 'Title', 'Type', 'Recipients', 'Remind At'],
            $rows
        );

        if ($dryRun) {
            $this->warn('Dry run enabled. No emails were sent, no logs were created, and no reminders were updated.');
            return self::SUCCESS;
        }

        $processedCount = 0;
        $failedCount = 0;
        $sentEmailCount = 0;
        $failedEmailCount = 0;
        $skippedCount = 0;

        foreach ($dueReminders as $reminder) {
            $recipients = $this->getRecipients($reminder);

            /*
            |--------------------------------------------------------------------------
            | No Recipients
            |--------------------------------------------------------------------------
            | If no organizer/staff email exists, log skipped and mark reminder as sent
            | so the scheduler does not keep processing the same useless row forever.
            */
            if (count($recipients) === 0) {
                $this->createLog(
                    reminder: $reminder,
                    recipientEmail: null,
                    recipientType: 'none',
                    status: 'skipped',
                    errorMessage: 'No valid recipient email found for organizer or assigned staff.'
                );

                $this->markReminderAsSent($reminder);

                $skippedCount++;
                $processedCount++;

                $this->warn("Reminder #{$reminder->id} skipped because no recipient email was found.");
                continue;
            }

            /*
            |--------------------------------------------------------------------------
            | No Mail Mode
            |--------------------------------------------------------------------------
            | Useful for testing. It creates skipped logs and marks reminder as sent.
            */
            if ($noMail) {
                foreach ($recipients as $recipient) {
                    $this->createLog(
                        reminder: $reminder,
                        recipientEmail: $recipient['email'],
                        recipientType: $recipient['type'],
                        status: 'skipped',
                        errorMessage: 'Email sending skipped because --no-mail option was used.'
                    );

                    $skippedCount++;
                }

                $this->markReminderAsSent($reminder);

                $processedCount++;

                $this->warn("Reminder #{$reminder->id} processed without email because --no-mail was used.");
                continue;
            }

            $successfulRecipients = 0;
            $failedRecipients = 0;

            foreach ($recipients as $recipient) {
                try {
                    Mail::to($recipient['email'])->send(new EventReminderDueMail($reminder));

                    $this->createLog(
                        reminder: $reminder,
                        recipientEmail: $recipient['email'],
                        recipientType: $recipient['type'],
                        status: 'sent',
                        errorMessage: null
                    );

                    $successfulRecipients++;
                    $sentEmailCount++;

                    $this->info("Email sent for reminder #{$reminder->id} to {$recipient['email']}.");
                } catch (Throwable $e) {
                    $this->createLog(
                        reminder: $reminder,
                        recipientEmail: $recipient['email'],
                        recipientType: $recipient['type'],
                        status: 'failed',
                        errorMessage: $e->getMessage()
                    );

                    $failedRecipients++;
                    $failedEmailCount++;

                    $this->error("Email failed for reminder #{$reminder->id} to {$recipient['email']}.");
                    $this->error($e->getMessage());

                    report($e);
                }
            }

            /*
            |--------------------------------------------------------------------------
            | Reminder Completion Rule
            |--------------------------------------------------------------------------
            | If at least one email was sent, mark reminder as sent.
            | If all emails failed, keep reminder pending so it can be retried later.
            */
            if ($successfulRecipients > 0) {
                $this->markReminderAsSent($reminder);

                $processedCount++;

                if ($failedRecipients > 0) {
                    $this->warn("Reminder #{$reminder->id} marked sent, but {$failedRecipients} recipient(s) failed.");
                } else {
                    $this->info("Reminder #{$reminder->id} fully processed.");
                }
            } else {
                $failedCount++;

                $this->warn("Reminder #{$reminder->id} remains pending because all recipient emails failed.");
            }
        }

        $this->line('');
        $this->info('Reminder processing finished.');
        $this->info("Processed reminders: {$processedCount}");
        $this->info("Sent emails: {$sentEmailCount}");
        $this->info("Failed emails: {$failedEmailCount}");
        $this->info("Skipped logs: {$skippedCount}");

        if ($failedCount > 0) {
            $this->warn("Pending reminders due to total email failure: {$failedCount}");
            return self::FAILURE;
        }

        return self::SUCCESS;
    }

    private function getRecipients(EventReminder $reminder): array
    {
        $recipients = [];

        /*
        |--------------------------------------------------------------------------
        | Organizer
        |--------------------------------------------------------------------------
        */
        if ($reminder->event?->user?->email) {
            $recipients[] = [
                'email' => $reminder->event->user->email,
                'type' => 'organizer',
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | Assigned Staff
        |--------------------------------------------------------------------------
        */
        if ($reminder->staff?->email) {
            $recipients[] = [
                'email' => $reminder->staff->email,
                'type' => 'staff',
            ];
        }

        return collect($recipients)
            ->filter(fn ($recipient) => !empty($recipient['email']))
            ->unique('email')
            ->values()
            ->toArray();
    }

    private function createLog(
        EventReminder $reminder,
        ?string $recipientEmail,
        string $recipientType,
        string $status,
        ?string $errorMessage = null
    ): EventReminderLog {
        return EventReminderLog::create([
            'event_reminder_id' => $reminder->id,
            'event_id' => $reminder->event_id,
            'recipient_email' => $recipientEmail,
            'recipient_type' => $recipientType,
            'status' => $status,
            'error_message' => $errorMessage,
            'sent_at' => $status === 'sent' ? now() : null,
        ]);
    }

    private function markReminderAsSent(EventReminder $reminder): void
    {
        DB::transaction(function () use ($reminder) {
            $reminder->update([
                'status' => 'sent',
                'sent_at' => now(),
            ]);
        });
    }
}
