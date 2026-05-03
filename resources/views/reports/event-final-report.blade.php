<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Event Final Report</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #111827;
            line-height: 1.5;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #111827;
            padding-bottom: 12px;
            margin-bottom: 18px;
        }

        .title {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 4px;
        }

        .subtitle {
            font-size: 13px;
            color: #4b5563;
        }

        .section {
            margin-top: 18px;
            margin-bottom: 12px;
        }

        .section-title {
            background: #111827;
            color: #ffffff;
            padding: 7px 10px;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 8px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background: #f3f4f6;
            font-weight: bold;
            text-align: left;
        }

        th, td {
            border: 1px solid #d1d5db;
            padding: 7px;
            vertical-align: top;
        }

        .summary-grid {
            width: 100%;
            border-collapse: collapse;
        }

        .summary-grid td {
            width: 25%;
            text-align: center;
            padding: 10px 6px;
        }

        .metric-label {
            font-size: 11px;
            color: #4b5563;
            display: block;
        }

        .metric-value {
            font-size: 17px;
            font-weight: bold;
            color: #111827;
            display: block;
            margin-top: 3px;
        }

        .muted {
            color: #6b7280;
        }

        .small {
            font-size: 10px;
        }

        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .badge-accepted {
            background: #dcfce7;
            color: #166534;
        }

        .badge-declined {
            background: #fee2e2;
            color: #991b1b;
        }

        .badge-pending {
            background: #fef3c7;
            color: #92400e;
        }

        .footer {
            margin-top: 30px;
            padding-top: 8px;
            border-top: 1px solid #d1d5db;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
        }

        .page-break {
            page-break-before: always;
        }

        .text-right {
            text-align: right;
        }

        .no-border td {
            border: none;
            padding: 3px 0;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="title">Final Event Report</div>
        <div class="subtitle">
            Generated on {{ $generatedAt->format('Y-m-d h:i A') }}
        </div>
    </div>

    <div class="section">
        <div class="section-title">1. Event Summary</div>

        <table>
            <tr>
                <th style="width: 28%;">Event Name</th>
                <td>{{ $event->title ?? $event->name ?? 'Untitled Event' }}</td>
            </tr>

            <tr>
                <th>Event Type</th>
                <td>{{ $event->type ?? $event->event_type ?? 'N/A' }}</td>
            </tr>

            <tr>
                <th>Event Date</th>
                <td>
                    @if (!empty($event->event_date))
                        {{ \Carbon\Carbon::parse($event->event_date)->format('Y-m-d') }}
                    @elseif (!empty($event->date))
                        {{ \Carbon\Carbon::parse($event->date)->format('Y-m-d') }}
                    @elseif (!empty($event->start_date))
                        {{ \Carbon\Carbon::parse($event->start_date)->format('Y-m-d') }}
                    @else
                        N/A
                    @endif
                </td>
            </tr>

            <tr>
                <th>Event Time</th>
                <td>
                    @if (!empty($event->event_time))
                        {{ $event->event_time }}
                    @elseif (!empty($event->start_time))
                        {{ $event->start_time }}
                    @else
                        N/A
                    @endif
                </td>
            </tr>

            <tr>
                <th>Location</th>
                <td>{{ $event->location ?? $event->venue ?? 'N/A' }}</td>
            </tr>

            <tr>
                <th>Organizer</th>
                <td>
                    {{ $organizer->name ?? 'N/A' }}

                    @if (!empty($organizer?->email))
                        <br>
                        <span class="muted">{{ $organizer->email }}</span>
                    @endif
                </td>
            </tr>

            <tr>
                <th>Description</th>
                <td>{{ $event->description ?? 'N/A' }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">2. Guest Summary</div>

        <table class="summary-grid">
            <tr>
                <td>
                    <span class="metric-label">Total Guests</span>
                    <span class="metric-value">{{ $guestSummary['total'] }}</span>
                </td>
                <td>
                    <span class="metric-label">Accepted</span>
                    <span class="metric-value">{{ $guestSummary['accepted'] }}</span>
                </td>
                <td>
                    <span class="metric-label">Declined</span>
                    <span class="metric-value">{{ $guestSummary['declined'] }}</span>
                </td>
                <td>
                    <span class="metric-label">Pending</span>
                    <span class="metric-value">{{ $guestSummary['pending'] }}</span>
                </td>
            </tr>
            <tr>
                <td>
                    <span class="metric-label">Checked In</span>
                    <span class="metric-value">{{ $guestSummary['checked_in'] }}</span>
                </td>
                <td>
                    <span class="metric-label">Total Guest Count</span>
                    <span class="metric-value">{{ $guestSummary['total_guest_count'] }}</span>
                </td>
                <td>
                    <span class="metric-label">Follow-ups Sent</span>
                    <span class="metric-value">{{ $followUpSummary['sent'] }}</span>
                </td>
                <td>
                    <span class="metric-label">Follow-up Attempts</span>
                    <span class="metric-value">{{ $followUpSummary['total_followup_count'] }}</span>
                </td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">3. RSVP / Invitation Summary</div>

        <table class="summary-grid">
            <tr>
                <td>
                    <span class="metric-label">Total Invitations</span>
                    <span class="metric-value">{{ $invitationSummary['total'] }}</span>
                </td>
                <td>
                    <span class="metric-label">Submitted / Responded</span>
                    <span class="metric-value">{{ $invitationSummary['submitted'] }}</span>
                </td>
                <td>
                    <span class="metric-label">Not Submitted</span>
                    <span class="metric-value">{{ $invitationSummary['not_submitted'] }}</span>
                </td>
                <td>
                    <span class="metric-label">Response Rate</span>
                    <span class="metric-value">
                        @if ($invitationSummary['total'] > 0)
                            {{ round(($invitationSummary['submitted'] / $invitationSummary['total']) * 100, 1) }}%
                        @else
                            0%
                        @endif
                    </span>
                </td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">4. Reminder Summary</div>

        <table class="summary-grid">
            <tr>
                <td>
                    <span class="metric-label">Reminder Rules</span>
                    <span class="metric-value">{{ $reminderSummary['reminders'] }}</span>
                </td>
                <td>
                    <span class="metric-label">Reminder Logs</span>
                    <span class="metric-value">{{ $reminderSummary['logs'] }}</span>
                </td>
                <td>
                    <span class="metric-label">Reviewed Logs</span>
                    <span class="metric-value">{{ $reminderSummary['reviewed'] }}</span>
                </td>
                <td>
                    <span class="metric-label">Pending Review</span>
                    <span class="metric-value">
                        {{ max($reminderSummary['logs'] - $reminderSummary['reviewed'], 0) }}
                    </span>
                </td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">5. Expense Summary</div>

        <table class="summary-grid">
            <tr>
                <td>
                    <span class="metric-label">Expense Records</span>
                    <span class="metric-value">{{ $expenseSummary['total_records'] }}</span>
                </td>
                <td>
                    <span class="metric-label">Total Amount</span>
                    <span class="metric-value">
                        {{ number_format($expenseSummary['total_amount'], 2) }}
                    </span>
                </td>
                <td>
                    <span class="metric-label">Amount Column Used</span>
                    <span class="metric-value small">
                        {{ $expenseSummary['amount_column'] ?? 'Not Found' }}
                    </span>
                </td>
                <td>
                    <span class="metric-label">Currency</span>
                    <span class="metric-value">LKR</span>
                </td>
            </tr>
        </table>

        @if (!$expenseSummary['amount_column'])
            <p class="small muted">
                Note: No valid amount column was found in event_expenses. Checked columns:
                amount, total_amount, cost, price, estimated_amount, actual_amount.
            </p>
        @endif
    </div>

    <div class="page-break"></div>

    <div class="section">
        <div class="section-title">6. Guest List</div>

        <table>
            <thead>
                <tr>
                    <th style="width: 5%;">#</th>
                    <th style="width: 18%;">Name</th>
                    <th style="width: 18%;">Email</th>
                    <th style="width: 14%;">Phone</th>
                    <th style="width: 10%;">Status</th>
                    <th style="width: 10%;">Count</th>
                    <th style="width: 12%;">Checked In</th>
                    <th style="width: 13%;">Follow-up</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($guestList as $index => $guest)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $guest->name ?? 'N/A' }}</td>
                        <td>{{ $guest->email ?? 'N/A' }}</td>
                        <td>{{ $guest->phone ?? 'N/A' }}</td>
                        <td>
                            @php
                                $status = $guest->status ?? 'pending';
                            @endphp

                            <span class="badge badge-{{ $status }}">
                                {{ ucfirst($status) }}
                            </span>
                        </td>
                        <td>{{ $guest->guest_count ?? 1 }}</td>
                        <td>
                            @if (!empty($guest->checked_in_at))
                                {{ \Carbon\Carbon::parse($guest->checked_in_at)->format('Y-m-d h:i A') }}
                            @else
                                No
                            @endif
                        </td>
                        <td>
                            @if (!empty($guest->followup_sent_at))
                                Sent
                                <br>
                                <span class="small muted">
                                    {{ \Carbon\Carbon::parse($guest->followup_sent_at)->format('Y-m-d h:i A') }}
                                </span>
                            @else
                                Not Sent
                            @endif

                            @if (isset($guest->followup_count))
                                <br>
                                <span class="small muted">
                                    Attempts: {{ $guest->followup_count }}
                                </span>
                            @endif
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="8" style="text-align: center;">
                            No guests found for this event.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">7. Recent Activity Logs</div>

        <table>
            <thead>
                <tr>
                    <th style="width: 18%;">Date / Time</th>
                    <th style="width: 18%;">Action</th>
                    <th style="width: 20%;">User</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($recentActivityLogs as $log)
                    <tr>
                        <td>
                            @if (!empty($log->created_at))
                                {{ \Carbon\Carbon::parse($log->created_at)->format('Y-m-d h:i A') }}
                            @else
                                N/A
                            @endif
                        </td>
                        <td>{{ $log->action ?? 'N/A' }}</td>
                        <td>{{ $log->user_name ?? 'System / Guest' }}</td>
                        <td>{{ $log->description ?? 'N/A' }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" style="text-align: center;">
                            No activity logs found for this event.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="footer">
        Smart Event Invitation & Planning System | Final Event Report
    </div>

</body>
</html>
