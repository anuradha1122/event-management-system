import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';

export default function Logs({
    auth,
    event,
    reminder,
    logs,
    logSummary,
    filters,
    filterOptions,
}) {
    const { flash } = usePage().props;

    const { data, setData, get, processing } = useForm({
        status: filters?.status || '',
        recipient_type: filters?.recipient_type || '',
        search: filters?.search || '',
    });

    const applyFilters = (e) => {
        e.preventDefault();

        get(route('events.reminders.logs', [event.id, reminder.id]), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.get(
            route('events.reminders.logs', [event.id, reminder.id]),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const retryFailed = () => {
        if (
            confirm(
                'Retry all failed email logs for this reminder? New logs will be created for retry attempts.'
            )
        ) {
            router.post(
                route('events.reminders.logs.retry-failed', [
                    event.id,
                    reminder.id,
                ])
            );
        }
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
        route('events.reminders.logs.export', [event.id, reminder.id]) +
        buildQueryString(data);

    const getStatusBadge = (status) => {
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
    };

    const getRecipientTypeBadge = (type) => {
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
    };

    const getReminderTypeLabel = (type) => {
        const labels = {
            general: 'General',
            task: 'Task',
            schedule: 'Schedule',
            payment: 'Payment',
            guest_followup: 'Guest Follow-up',
            vendor: 'Vendor',
        };

        return labels[type] || type || '-';
    };

    const getRelatedTo = () => {
        if (reminder.task) {
            return `Task: ${reminder.task.title}`;
        }

        if (reminder.schedule) {
            return `Schedule: ${reminder.schedule.title}`;
        }

        return '-';
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Reminder Logs - ${reminder.title}`} />

            <div className="p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Reminder Email Logs
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            {event.title}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={route('events.reminders.index', event.id)}
                            style={buttonStyle('#4b5563')}
                        >
                            Back to Reminders
                        </Link>

                        <Link
                            href={route('events.reminders.edit', [
                                event.id,
                                reminder.id,
                            ])}
                            style={buttonStyle('#2563eb')}
                        >
                            Edit Reminder
                        </Link>

                        <a href={exportUrl} style={buttonStyle('#16a34a')}>
                            Export CSV
                        </a>

                        {(logSummary?.failed ?? 0) > 0 && (
                            <button
                                type="button"
                                onClick={retryFailed}
                                style={buttonStyle('#dc2626')}
                            >
                                Retry Failed Emails
                            </button>
                        )}
                    </div>
                </div>

                {flash?.success && (
                    <div className="mb-4 rounded bg-green-100 px-4 py-3 font-semibold text-green-800">
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="mb-4 rounded bg-red-100 px-4 py-3 font-semibold text-red-800">
                        {flash.error}
                    </div>
                )}

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
                    <SummaryCard
                        label="Total Logs"
                        value={logSummary?.total ?? 0}
                        background="#f9fafb"
                        color="#111827"
                    />

                    <SummaryCard
                        label="Sent"
                        value={logSummary?.sent ?? 0}
                        background="#dcfce7"
                        color="#166534"
                    />

                    <SummaryCard
                        label="Failed"
                        value={logSummary?.failed ?? 0}
                        background="#fee2e2"
                        color="#991b1b"
                    />

                    <SummaryCard
                        label="Skipped"
                        value={logSummary?.skipped ?? 0}
                        background="#fef3c7"
                        color="#92400e"
                    />

                    <SummaryCard
                        label="Filtered"
                        value={logSummary?.filtered_total ?? 0}
                        background="#dbeafe"
                        color="#1d4ed8"
                    />
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div
                        className="lg:col-span-2"
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '16px',
                            padding: '20px',
                            boxShadow: '0 1px 5px rgba(0,0,0,0.08)',
                        }}
                    >
                        <h2 className="mb-3 text-lg font-bold text-gray-900">
                            Reminder Details
                        </h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <InfoItem label="Title" value={reminder.title} />
                            <InfoItem
                                label="Type"
                                value={getReminderTypeLabel(
                                    reminder.reminder_type
                                )}
                            />
                            <InfoItem
                                label="Related To"
                                value={getRelatedTo()}
                            />
                            <InfoItem
                                label="Assigned Staff"
                                value={
                                    reminder.staff
                                        ? `${reminder.staff.name}${
                                              reminder.staff.role
                                                  ? ` - ${reminder.staff.role}`
                                                  : ''
                                          }`
                                        : '-'
                                }
                            />
                            <InfoItem
                                label="Remind At"
                                value={reminder.remind_at || '-'}
                            />
                            <InfoItem
                                label="Sent At"
                                value={reminder.sent_at || '-'}
                            />
                        </div>

                        {reminder.message && (
                            <div className="mt-4">
                                <div className="text-sm font-bold text-gray-500">
                                    Message
                                </div>
                                <div className="mt-1 rounded bg-gray-50 p-3 text-sm text-gray-700">
                                    {reminder.message}
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '16px',
                            padding: '20px',
                            boxShadow: '0 1px 5px rgba(0,0,0,0.08)',
                        }}
                    >
                        <h2 className="mb-3 text-lg font-bold text-gray-900">
                            Reminder Status
                        </h2>

                        <div>
                            <span style={getReminderStatusBadge(reminder.status)}>
                                {reminder.status}
                            </span>
                        </div>

                        {(logSummary?.failed ?? 0) > 0 && (
                            <div className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">
                                Failed emails found. Use the retry button above
                                to attempt sending again.
                            </div>
                        )}

                        <div className="mt-4 rounded bg-green-50 p-3 text-sm text-green-700">
                            CSV export uses the current filters. Because yes,
                            even exports should behave like they know what page
                            they came from.
                        </div>
                    </div>
                </div>

                <div className="mb-6 rounded bg-white p-5 shadow">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-900">
                            Filter Logs
                        </h2>
                        <p className="text-sm text-gray-500">
                            Filter email attempts by status, recipient type, or
                            email address.
                        </p>
                    </div>

                    <form
                        onSubmit={applyFilters}
                        className="grid grid-cols-1 gap-4 md:grid-cols-4"
                    >
                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-700">
                                Status
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
                                value={data.search}
                                onChange={(e) =>
                                    setData('search', e.target.value)
                                }
                                placeholder="Search email..."
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
                            Email Delivery History
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Each row shows an email attempt for this reminder.
                            Failed retries create new log rows, because history
                            is not something we sweep under the carpet like bad
                            CSS.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Recipient Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Recipient Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Status
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
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">
                                {logs.data.length > 0 ? (
                                    logs.data.map((log) => (
                                        <tr key={log.id} className="align-top">
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                                                {log.recipient_email || '-'}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <span
                                                    style={getRecipientTypeBadge(
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
                                                    style={getStatusBadge(
                                                        log.status
                                                    )}
                                                >
                                                    {log.status}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                {log.reviewed_at ? (
                                                    <div>
                                                        <span
                                                            style={reviewedBadgeStyle()}
                                                        >
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
                                                    <span
                                                        style={notReviewedBadgeStyle()}
                                                    >
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
                                                {log.status === 'failed' &&
                                                !log.reviewed_at ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            markReviewed(log.id)
                                                        }
                                                        style={smallButtonStyle(
                                                            '#16a34a'
                                                        )}
                                                    >
                                                        Mark Reviewed
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-400">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-10 text-center text-sm text-gray-500"
                                        >
                                            No logs found for the selected filters.
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

function InfoItem({ label, value }) {
    return (
        <div>
            <div className="text-sm font-bold text-gray-500">{label}</div>

            <div className="mt-1 text-sm font-semibold text-gray-900">
                {value || '-'}
            </div>
        </div>
    );
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

function getReminderStatusBadge(status) {
    const styles = {
        pending: {
            backgroundColor: '#fef3c7',
            color: '#92400e',
        },
        sent: {
            backgroundColor: '#dcfce7',
            color: '#166534',
        },
        cancelled: {
            backgroundColor: '#fee2e2',
            color: '#991b1b',
        },
    };

    return {
        display: 'inline-flex',
        padding: '4px 10px',
        borderRadius: '999px',
        fontWeight: '700',
        fontSize: '12px',
        ...(styles[status] || styles.pending),
    };
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

function buildQueryString(data) {
    const params = new URLSearchParams();

    if (data.status) {
        params.append('status', data.status);
    }

    if (data.recipient_type) {
        params.append('recipient_type', data.recipient_type);
    }

    if (data.search) {
        params.append('search', data.search);
    }

    const queryString = params.toString();

    return queryString ? `?${queryString}` : '';
}
