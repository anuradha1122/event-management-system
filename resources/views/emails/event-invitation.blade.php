<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Event Invitation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 30px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
                    <tr>
                        <td style="background-color: {{ $event->theme_color ?: '#111827' }}; padding: 28px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 26px;">
                                You're Invited
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 30px;">
                            <p style="font-size: 16px; color: #111827;">
                                Dear {{ $guest->name }},
                            </p>

                            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                                You are invited to:
                            </p>

                            <h2 style="font-size: 24px; color: #111827; margin: 10px 0;">
                                {{ $event->title }}
                            </h2>

                            @if(!empty($event->event_type))
                                <p style="font-size: 14px; color: #6b7280;">
                                    Type: {{ $event->event_type }}
                                </p>
                            @endif

                            @if(!empty($event->event_date))
                                <p style="font-size: 14px; color: #6b7280;">
                                    Date: {{ $event->event_date }}
                                </p>
                            @endif

                            @if(!empty($event->location))
                                <p style="font-size: 14px; color: #6b7280;">
                                    Location: {{ $event->location }}
                                </p>
                            @endif

                            @if(!empty($event->dress_code))
                                <p style="font-size: 14px; color: #6b7280;">
                                    Dress Code: {{ $event->dress_code }}
                                </p>
                            @endif

                            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-top: 24px;">
                                Please open your invitation and submit your RSVP using the button below.
                            </p>

                            <p style="text-align: center; margin: 32px 0;">
                                <a href="{{ $inviteUrl }}"
                                   style="display: inline-block; background-color: {{ $event->theme_color ?: '#111827' }}; color: #ffffff; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                                    Open Invitation
                                </a>
                            </p>

                            <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
                                If the button does not work, copy and paste this link into your browser:
                            </p>

                            <p style="font-size: 14px; color: #2563eb; word-break: break-all;">
                                {{ $inviteUrl }}
                            </p>

                            @if(!empty($event->contact_name) || !empty($event->contact_phone))
                                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0;">

                                <p style="font-size: 14px; color: #374151;">
                                    Contact:
                                    @if(!empty($event->contact_name))
                                        {{ $event->contact_name }}
                                    @endif

                                    @if(!empty($event->contact_phone))
                                        - {{ $event->contact_phone }}
                                    @endif
                                </p>
                            @endif

                            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                                Thank you.
                            </p>
                        </td>
                    </tr>
                </table>

                <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">
                    This invitation was sent through Smart Event Invitation & Planning System.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
