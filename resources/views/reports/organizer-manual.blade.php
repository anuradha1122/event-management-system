<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Organizer User Manual</title>

    <style>
        @page {
            margin: 28px 32px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #111827;
            line-height: 1.5;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #111827;
            padding-bottom: 14px;
            margin-bottom: 18px;
        }

        .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #0f172a;
        }

        .subtitle {
            font-size: 13px;
            color: #475569;
        }

        .meta {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
        }

        .meta td {
            border: 1px solid #cbd5e1;
            padding: 7px;
            vertical-align: top;
        }

        .meta .label {
            background: #f1f5f9;
            font-weight: bold;
            color: #334155;
            width: 22%;
        }

        .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            color: #ffffff;
            font-weight: bold;
            font-size: 11px;
        }

        .status-draft {
            background: #64748b;
        }

        .status-active {
            background: #16a34a;
        }

        .status-completed {
            background: #2563eb;
        }

        .status-cancelled {
            background: #dc2626;
        }

        .summary-grid {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
        }

        .summary-grid td {
            width: 25%;
            border: 1px solid #cbd5e1;
            padding: 8px;
            text-align: center;
        }

        .summary-label {
            font-size: 10px;
            color: #64748b;
            font-weight: bold;
            text-transform: uppercase;
        }

        .summary-value {
            font-size: 18px;
            font-weight: bold;
            color: #0f172a;
            margin-top: 4px;
        }

        .section {
            page-break-inside: avoid;
            margin-bottom: 16px;
            border: 1px solid #dbeafe;
            border-radius: 6px;
            padding: 12px;
        }

        .section-header {
            margin-bottom: 8px;
        }

        .section-number {
            display: inline-block;
            background: #eef2ff;
            color: #3730a3;
            padding: 3px 7px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #0f172a;
            margin: 4px 0 8px;
        }

        .paragraph {
            margin: 0 0 7px;
            color: #334155;
        }

        ul {
            margin: 8px 0 0 18px;
            padding: 0;
        }

        li {
            margin-bottom: 5px;
        }

        .workflow-box {
            background: #f8fafc;
            border: 1px dashed #94a3b8;
            padding: 10px;
            margin-top: 12px;
            border-radius: 5px;
        }

        .workflow-title {
            font-weight: bold;
            color: #0f172a;
            margin-bottom: 6px;
        }

        .footer-note {
            margin-top: 18px;
            padding-top: 10px;
            border-top: 1px solid #cbd5e1;
            color: #64748b;
            font-size: 10px;
            text-align: center;
        }

        .page-break {
            page-break-before: always;
        }

        .toc {
            border: 1px solid #cbd5e1;
            padding: 12px;
            margin-bottom: 18px;
            background: #f8fafc;
        }

        .toc-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #0f172a;
        }

        .toc table {
            width: 100%;
            border-collapse: collapse;
        }

        .toc td {
            padding: 3px 4px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 11px;
        }

        .toc-number {
            width: 45px;
            font-weight: bold;
            color: #3730a3;
        }

        .muted {
            color: #64748b;
        }
    </style>
</head>

<body>
    @php
        $status = $event->status ?? 'draft';

        $statusClass = match ($status) {
            'active' => 'status-active',
            'completed' => 'status-completed',
            'cancelled' => 'status-cancelled',
            default => 'status-draft',
        };

        $statusLabel = ucfirst($status);
    @endphp

    <div class="header">
        <div class="title">Organizer User Manual</div>
        <div class="subtitle">
            Smart Event Invitation & Planning System
        </div>
        <div class="subtitle">
            Generated on {{ $generatedAt?->format('Y-m-d H:i') }}
        </div>
    </div>

    <table class="meta">
        <tr>
            <td class="label">Event Title</td>
            <td>{{ $event->title ?? 'N/A' }}</td>
            <td class="label">Status</td>
            <td>
                <span class="status {{ $statusClass }}">
                    {{ $statusLabel }}
                </span>
            </td>
        </tr>

        <tr>
            <td class="label">Event Date</td>
            <td>
                {{ $event->event_date ? $event->event_date->format('Y-m-d') : 'N/A' }}
            </td>
            <td class="label">Event Time</td>
            <td>{{ $event->event_time ?? 'N/A' }}</td>
        </tr>

        <tr>
            <td class="label">Venue</td>
            <td>{{ $event->venue ?? 'N/A' }}</td>
            <td class="label">Event Type</td>
            <td>{{ $event->event_type ?? 'N/A' }}</td>
        </tr>

        <tr>
            <td class="label">Organizer</td>
            <td>
                {{ $event->user?->name ?? $organizer?->name ?? 'N/A' }}
                @if (!empty($event->user?->email ?? $organizer?->email))
                    <br>
                    <span class="muted">
                        {{ $event->user?->email ?? $organizer?->email }}
                    </span>
                @endif
            </td>
            <td class="label">Contact</td>
            <td>
                {{ $event->contact_name ?? 'N/A' }}
                @if (!empty($event->contact_phone))
                    <br>
                    <span class="muted">{{ $event->contact_phone }}</span>
                @endif
            </td>
        </tr>
    </table>

    <table class="summary-grid">
        <tr>
            <td>
                <div class="summary-label">Guests</div>
                <div class="summary-value">{{ $event->guests_count ?? 0 }}</div>
            </td>

            <td>
                <div class="summary-label">Invitations</div>
                <div class="summary-value">{{ $event->invitations_count ?? 0 }}</div>
            </td>

            <td>
                <div class="summary-label">RSVP Questions</div>
                <div class="summary-value">{{ $event->questions_count ?? 0 }}</div>
            </td>

            <td>
                <div class="summary-label">QA Checks</div>
                <div class="summary-value">{{ $event->qa_checks_count ?? 0 }}</div>
            </td>
        </tr>

        <tr>
            <td>
                <div class="summary-label">Tasks</div>
                <div class="summary-value">{{ $event->tasks_count ?? 0 }}</div>
            </td>

            <td>
                <div class="summary-label">Expenses</div>
                <div class="summary-value">{{ $event->expenses_count ?? 0 }}</div>
            </td>

            <td>
                <div class="summary-label">Vendors</div>
                <div class="summary-value">{{ $event->vendors_count ?? 0 }}</div>
            </td>

            <td>
                <div class="summary-label">Activity Logs</div>
                <div class="summary-value">{{ $event->activity_logs_count ?? 0 }}</div>
            </td>
        </tr>
    </table>

    <div class="toc">
        <div class="toc-title">Table of Contents</div>

        <table>
            @foreach ($manualSections as $section)
                <tr>
                    <td class="toc-number">{{ $section['number'] }}</td>
                    <td>{{ $section['title'] }}</td>
                </tr>
            @endforeach
        </table>
    </div>

    <div class="page-break"></div>

    @foreach ($manualSections as $section)
        <div class="section">
            <div class="section-header">
                <span class="section-number">Section {{ $section['number'] }}</span>
                <div class="section-title">{{ $section['title'] }}</div>
            </div>

            @foreach ($section['body'] as $paragraph)
                <p class="paragraph">{{ $paragraph }}</p>
            @endforeach

            @if (!empty($section['items']))
                <ul>
                    @foreach ($section['items'] as $item)
                        <li>{{ $item }}</li>
                    @endforeach
                </ul>
            @endif
        </div>
    @endforeach

    <div class="workflow-box">
        <div class="workflow-title">Recommended Final Workflow</div>
        <div>
            Manage Event → QA Checklist → Final Event Report PDF → Project Summary → Organizer Manual → Organizer Manual PDF
        </div>
    </div>

    <div class="footer-note">
        This document was generated by the Smart Event Invitation & Planning System.
    </div>
</body>
</html>
