import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function EventLogs({
    auth,
    event,
    logs,
    summary,
    filters,
    filterOptions,
}) {
    const { data, setData, get, processing } = useForm({
        status: filters?.status || '',
        recipient_type: filters?.recipient_type || '',
        recipient_search: filters?.recipient_search || '',
        reminder_search: filters?.reminder_search || '',
    });

    const applyFilters = (e) => {
        e.preventDefault();

        get(route('events.reminder-logs.index', event.id), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.get(
            route('events.reminder-logs.index', event.id),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const markReviewed = (logId) => {
        if (!confirm('Mark this failed email log as reviewed?')) {
            return;
        }

        router.patch(
            route('events.reminder-logs.review', [event.id, logId]),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const exportUrl =
        route('events.reminder-logs.export', event.id) + buildQueryString(data);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Reminder Logs - ${event.title}`} />

            <div className="p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Event Reminder Logs
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            {event.title}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            {event.event_date || '-'} {event.event_time || ''}
                            {event.venue ? ` • ${event.venue}` : ''}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={route('events.show', event.id)}
                            style={buttonStyle('#4b5563')}
                        >
                            Back to Event
                        </Link>

                        <Link
                            href={route('events.reminders.index', event.id)}
                            style={buttonStyle('#7c3aed')}
                        >
                            Reminders
                        </Link>

                        <a href={exportUrl} style={buttonStyle('#16a34a')}>
                            Export CSV
                        </a>
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
                    <SummaryCard
                        label="Total Logs"
                        value={summary?.total ?? 0}
                        background="#f9fafb"
                        color="#111827"
                    />

                    <SummaryCard
                        label="Sent"
                        value={summary?.sent ?? 0}
                        background="#dcfce7"
                        color="#166534"
                    />

                    <SummaryCard
                        label="Failed"
                        value={summary?.failed ?? 0}
                        background="#fee2e2"
                        color="#991b1b"
                    />

                    <SummaryCard
                        label="Skipped"
                        value={summary?.skipped ?? 0}
                        background="#fef3c7"
                        color="#92400e"
                    />

                    <SummaryCard
                        label="Filtered"
                        value={summary?.filtered_total ?? 0}
                        background="#dbeafe"
                        color="#1d4ed8"
                    />
                </div>

                <div className="mb-6 rounded bg-white p-5 shadow">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-900">
                            Filter Event Logs
                        </h2>
                        <p className="text-sm text-gray-500">
                            Filter all reminder email logs for this event.
                        </p>
                    </div>

                    <form
                        onSubmit={applyFilters}
                        className="grid grid-cols-1 gap-4 md:grid-cols-5"
                    >
                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-700">
                                Log Status
                            </label>

                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                style={inputStyle()}
                            >
                                {Object.entries(
                                    filterOptions?.statuses || {}
                                ).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-700">
                                Recipient Type
                            </label>

                            <select
                                value={data.recipient_type}
                                onChange={(e) =>
                                    setData('recipient_type', e.target.value)
                                }
                                style={inputStyle()}
                            >
                                {Object.entries(
                                    filterOptions?.recipientTypes || {}
                                ).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-700">
                                Recipient Email
                            </label>

                            <input
                                type="text"
                                value={data.recipient_search}
                                onChange={(e) =>
                                    setData(
                                        'recipient_search',
                                        e.target.value
                                    )
                                }
                                placeholder="Search email..."
                                style={inputStyle()}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-700">
                                Reminder Title
                            </label>

                            <input
                                type="text"
                                value={data.reminder_search}
                                onChange={(e) =>
                                    setData(
                                        'reminder_search',
                                        e.target.value
                                    )
                                }
                                placeholder="Search reminder..."
                                style={inputStyle()}
                            />
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    ...buttonStyle('#2563eb'),
                                    opacity: processing ? 0.7 : 1,
                                }}
                            >
                                Filter
                            </button>

                            <button
                                type="button"
                                onClick={clearFilters}
                                style={buttonStyle('#6b7280')}
                            >
                                Clear
                            </button>
                        </div>
                    </form>
                </div>

                <div className="rounded bg-white shadow">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="text-lg font-bold text-gray-900">
                            Email Delivery Logs
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            This table shows all reminder email attempts for the selected event.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Reminder
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Type
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Recipient Email
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Recipient Type
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Log Status
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Reviewed
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Sent At
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Logged At
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Error
                                    </th>

                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">
                                {logs.data.length > 0 ? (
                                    logs.data.map((log) => (
                                        <tr key={log.id} className="align-top">
                                            <td className="px-6 py-4 text-sm">
                                                <div className="font-bold text-gray-900">
                                                    {log.reminder?.title || '-'}
                                                </div>

                                                <div className="mt-1 text-xs text-gray-500">
                                                    Remind At:{' '}
                                                    {log.reminder?.remind_at ||
                                                        '-'}
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                {log.reminder?.reminder_type_label ||
                                                    '-'}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                                                {log.recipient_email || '-'}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <span
                                                    style={recipientBadgeStyle(
                                                        log.recipient_type
                                                    )}
                                                >
                                                    {formatRecipientType(
                                                        log.recipient_type
                                                    )}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <span
                                                    style={statusBadgeStyle(
                                                        log.status
                                                    )}
                                                >
                                                    {log.status}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                {log.reviewed_at ? (
                                                    <div>
                                                        <span style={reviewedBadgeStyle()}>
                                                            Reviewed
                                                        </span>

                                                        <div className="mt-1 text-xs text-gray-500">
                                                            {log.reviewed_at}
                                                            {log.reviewer?.name
                                                                ? ` by ${log.reviewer.name}`
                                                                : ''}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span style={notReviewedBadgeStyle()}>
                                                        Not Reviewed
                                                    </span>
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                {log.sent_at || '-'}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                {log.created_at || '-'}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {log.error_message ? (
                                                    <div className="max-w-md rounded bg-red-50 p-2 text-xs text-red-700">
                                                        {log.error_message}
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                <div className="flex justify-end gap-2">
                                                    {log.status === 'failed' &&
                                                        !log.reviewed_at && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    markReviewed(
                                                                        log.id
                                                                    )
                                                                }
                                                                style={smallButtonStyle(
                                                                    '#16a34a'
                                                                )}
                                                            >
                                                                Mark Reviewed
                                                            </button>
                                                        )}

                                                    {log.reminder?.id && (
                                                        <Link
                                                            href={route(
                                                                'events.reminders.logs',
                                                                [
                                                                    event.id,
                                                                    log.reminder.id,
                                                                ]
                                                            )}
                                                            style={smallButtonStyle(
                                                                '#7c3aed'
                                                            )}
                                                        >
                                                            Open
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="10"
                                            className="px-6 py-10 text-center text-sm text-gray-500"
                                        >
                                            No reminder logs found for the selected filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {logs.links && logs.links.length > 3 && (
                        <div className="flex flex-wrap gap-2 border-t border-gray-200 px-6 py-4">
                            {logs.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    preserveScroll
                                    style={{
                                        display: 'inline-flex',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        fontSize: '13px',
                                        textDecoration: 'none',
                                        backgroundColor: link.active
                                            ? '#2563eb'
                                            : '#f3f4f6',
                                        color: link.active
                                            ? '#ffffff'
                                            : '#374151',
                                        pointerEvents: link.url ? 'auto' : 'none',
                                        opacity: link.url ? 1 : 0.5,
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function SummaryCard({ label, value, background, color }) {
    return (
        <div
            style={{
                backgroundColor: background,
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 1px 5px rgba(0,0,0,0.08)',
            }}
        >
            <p
                style={{
                    color: '#6b7280',
                    fontSize: '13px',
                    fontWeight: '700',
                    marginBottom: '8px',
                }}
            >
                {label}
            </p>

            <p
                style={{
                    color,
                    fontSize: '34px',
                    fontWeight: '900',
                    lineHeight: '1',
                }}
            >
                {value ?? 0}
            </p>
        </div>
    );
}

function inputStyle() {
    return {
        width: '100%',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '14px',
    };
}

function buttonStyle(backgroundColor) {
    return {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        color: '#ffffff',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '700',
        textDecoration: 'none',
        border: `1px solid ${backgroundColor}`,
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        cursor: 'pointer',
    };
}

function smallButtonStyle(backgroundColor) {
    return {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        color: '#ffffff',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '700',
        textDecoration: 'none',
        border: `1px solid ${backgroundColor}`,
        boxShadow: '0 2px 5px rgba(0,0,0,0.12)',
        cursor: 'pointer',
    };
}

function statusBadgeStyle(status) {
    const styles = {
        sent: {
            backgroundColor: '#dcfce7',
            color: '#166534',
        },
        failed: {
            backgroundColor: '#fee2e2',
            color: '#991b1b',
        },
        skipped: {
            backgroundColor: '#fef3c7',
            color: '#92400e',
        },
    };

    return {
        display: 'inline-flex',
        padding: '4px 10px',
        borderRadius: '999px',
        fontWeight: '700',
        fontSize: '12px',
        ...(styles[status] || styles.skipped),
    };
}

function recipientBadgeStyle(type) {
    const styles = {
        organizer: {
            backgroundColor: '#dbeafe',
            color: '#1d4ed8',
        },
        staff: {
            backgroundColor: '#ede9fe',
            color: '#6d28d9',
        },
        none: {
            backgroundColor: '#e5e7eb',
            color: '#374151',
        },
        unknown: {
            backgroundColor: '#e5e7eb',
            color: '#374151',
        },
    };

    return {
        display: 'inline-flex',
        padding: '4px 10px',
        borderRadius: '999px',
        fontWeight: '700',
        fontSize: '12px',
        ...(styles[type] || styles.unknown),
    };
}

function reviewedBadgeStyle() {
    return {
        display: 'inline-flex',
        padding: '4px 10px',
        borderRadius: '999px',
        fontWeight: '700',
        fontSize: '12px',
        backgroundColor: '#dcfce7',
        color: '#166534',
    };
}

function notReviewedBadgeStyle() {
    return {
        display: 'inline-flex',
        padding: '4px 10px',
        borderRadius: '999px',
        fontWeight: '700',
        fontSize: '12px',
        backgroundColor: '#ffedd5',
        color: '#9a3412',
    };
}

function formatRecipientType(type) {
    const labels = {
        organizer: 'Organizer',
        staff: 'Staff',
        none: 'No Recipient',
        unknown: 'Unknown',
    };

    return labels[type] || type || '-';
}

function buildQueryString(data) {
    const params = new URLSearchParams();

    if (data.status) {
        params.append('status', data.status);
    }

    if (data.recipient_type) {
        params.append('recipient_type', data.recipient_type);
    }

    if (data.recipient_search) {
        params.append('recipient_search', data.recipient_search);
    }

    if (data.reminder_search) {
        params.append('reminder_search', data.reminder_search);
    }

    const queryString = params.toString();

    return queryString ? `?${queryString}` : '';
}
