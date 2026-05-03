<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Event Reminder</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 30px 0;">
        <tr>
            <td align="center">
                <table width="620" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="background-color: #7c3aed; color: #ffffff; padding: 22px 28px;">
                            <h1 style="margin: 0; font-size: 22px;">
                                Event Reminder
                            </h1>
                            <p style="margin: 6px 0 0; font-size: 14px;">
                                A reminder is now due.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 28px;">
                            <h2 style="margin: 0 0 12px; color: #111827; font-size: 20px;">
                                {{ $reminder->title }}
                            </h2>

                            @if($reminder->message)
                                <p style="margin: 0 0 22px; color: #374151; font-size: 15px; line-height: 1.6;">
                                    {{ $reminder->message }}
                                </p>
                            @endif

                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-top: 18px;">
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; color: #374151; background-color: #f9fafb;">
                                        Event
                                    </td>
                                    <td style="padding: 10px; border: 1px solid #e5e7eb; color: #111827;">
                                        {{ $event?->title ?? '-' }}
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; color: #374151; background-color: #f9fafb;">
                                        Venue
                                    </td>
                                    <td style="padding: 10px; border: 1px solid #e5e7eb; color: #111827;">
                                        {{ $event?->venue ?? '-' }}
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; color: #374151; background-color: #f9fafb;">
                                        Event Date
                                    </td>
                                    <td style="padding: 10px; border: 1px solid #e5e7eb; color: #111827;">
                                        {{ $event?->event_date ?? '-' }}
                                        {{ $event?->event_time ? ' at ' . $event->event_time : '' }}
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; color: #374151; background-color: #f9fafb;">
                                        Reminder Type
                                    </td>
                                    <td style="padding: 10px; border: 1px solid #e5e7eb; color: #111827;">
                                        {{ ucwords(str_replace('_', ' ', $reminder->reminder_type)) }}
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; color: #374151; background-color: #f9fafb;">
                                        Remind At
                                    </td>
                                    <td style="padding: 10px; border: 1px solid #e5e7eb; color: #111827;">
                                        {{ optional($reminder->remind_at)->format('Y-m-d H:i') }}
                                    </td>
                                </tr>

                                @if($task)
                                    <tr>
                                        <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; color: #374151; background-color: #f9fafb;">
                                            Related Task
                                        </td>
                                        <td style="padding: 10px; border: 1px solid #e5e7eb; color: #111827;">
                                            {{ $task->title }}
                                        </td>
                                    </tr>
                                @endif

                                @if($schedule)
                                    <tr>
                                        <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; color: #374151; background-color: #f9fafb;">
                                            Related Schedule
                                        </td>
                                        <td style="padding: 10px; border: 1px solid #e5e7eb; color: #111827;">
                                            {{ $schedule->title }}
                                            @if($schedule->schedule_date)
                                                <br>
                                                <small>
                                                    {{ $schedule->schedule_date }}
                                                    {{ $schedule->start_time ? ' at ' . $schedule->start_time : '' }}
                                                </small>
                                            @endif
                                        </td>
                                    </tr>
                                @endif

                                @if($staff)
                                    <tr>
                                        <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; color: #374151; background-color: #f9fafb;">
                                            Assigned Staff
                                        </td>
                                        <td style="padding: 10px; border: 1px solid #e5e7eb; color: #111827;">
                                            {{ $staff->name }}
                                            @if($staff->role)
                                                <br>
                                                <small>{{ $staff->role }}</small>
                                            @endif
                                        </td>
                                    </tr>
                                @endif
                            </table>

                            <p style="margin-top: 24px; color: #6b7280; font-size: 13px; line-height: 1.6;">
                                This is an automatic reminder from the Smart Event Invitation & Planning System.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f9fafb; padding: 18px 28px; color: #6b7280; font-size: 12px; text-align: center;">
                            Smart Event Invitation & Planning System
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
