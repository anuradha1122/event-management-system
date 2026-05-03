<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Event Follow-Up</title>
</head>
<body style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
    <h2 style="margin-bottom: 8px;">{{ $event->title }}</h2>

    <p>Dear {{ $guest->name ?? 'Guest' }},</p>

    @if($messageText)
        <p>{{ $messageText }}</p>
    @else
        <p>
            This is a friendly reminder regarding the event invitation.
            Please check your invitation and respond if you have not already done so.
        </p>
    @endif

    <table style="border-collapse: collapse; margin-top: 16px; margin-bottom: 16px;">
        <tr>
            <td style="font-weight: bold; padding: 4px 12px 4px 0;">Event:</td>
            <td>{{ $event->title }}</td>
        </tr>

        <tr>
            <td style="font-weight: bold; padding: 4px 12px 4px 0;">Date:</td>
            <td>{{ $event->event_date ?? '-' }}</td>
        </tr>

        <tr>
            <td style="font-weight: bold; padding: 4px 12px 4px 0;">Time:</td>
            <td>{{ $event->event_time ?? '-' }}</td>
        </tr>

        <tr>
            <td style="font-weight: bold; padding: 4px 12px 4px 0;">Venue:</td>
            <td>{{ $event->venue ?? '-' }}</td>
        </tr>
    </table>

    @if($inviteUrl)
        <p>
            <a
                href="{{ $inviteUrl }}"
                style="display: inline-block; background: #2563eb; color: #ffffff; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-weight: bold;"
            >
                Open Invitation
            </a>
        </p>

        <p style="font-size: 13px; color: #6b7280;">
            Invitation link: {{ $inviteUrl }}
        </p>
    @endif

    <p>Thank you.</p>
</body>
</html>
