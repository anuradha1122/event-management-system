import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Index({
    auth,
    summary = {},
    items = [],
    events = [],
    filters = {},
    filterOptions = {},
}) {
    const safeAuth = auth || {};
    const safeSummary = {
        total_alerts: 0,
        upcoming_reminders: 0,
        overdue_reminders: 0,
        failed_emails: 0,
        sent_emails: 0,
        cancelled_reminders: 0,
        ...summary,
    };

    const safeItems = Array.isArray(items) ? items : [];
    const safeEvents = Array.isArray(events) ? events : [];

    const { data, setData, get, processing } = useForm({
        event_id: filters?.event_id || '',
        type: filters?.type || '',
    });

    const routeExists = (name, params = undefined) => {
        try {
            route(name, params);
            return true;
        } catch (error) {
            return false;
        }
    };

    const applyFilters = (e) => {
        e.preventDefault();

        get(route('notifications.index'), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.get(
            route('notifications.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    return (
        <AuthenticatedLayout user={safeAuth.user}>
            <Head title="Notification Center" />

            <div className="p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Notification Center
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Central place for reminders, failed emails, and event alerts.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {routeExists('dashboard') && (
                            <Link
                                href={route('dashboard')}
                                style={buttonStyle('#4b5563')}
                            >
                                Dashboard
                            </Link>
                        )}

                        {routeExists('events.index') && (
                            <Link
                                href={route('events.index')}
                                style={buttonStyle('#111827')}
                            >
                                Events
                            </Link>
                        )}
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    <SummaryCard
                        label="Total Alerts"
                        value={safeSummary.total_alerts}
                        background="#f9fafb"
                        color="#111827"
                    />

                    <SummaryCard
                        label="Upcoming"
                        value={safeSummary.upcoming_reminders}
                        background="#dbeafe"
                        color="#1d4ed8"
                    />

                    <SummaryCard
                        label="Overdue"
                        value={safeSummary.overdue_reminders}
                        background="#fee2e2"
                        color="#991b1b"
                    />

                    <SummaryCard
                        label="Failed Emails"
                        value={safeSummary.failed_emails}
                        background="#ffe4e6"
                        color="#be123c"
                    />

                    <SummaryCard
                        label="Sent Emails"
                        value={safeSummary.sent_emails}
                        background="#dcfce7"
                        color="#166534"
                    />

                    <SummaryCard
                        label="Cancelled"
                        value={safeSummary.cancelled_reminders}
                        background="#fef3c7"
                        color="#92400e"
                    />
                </div>

                <div className="mb-6 rounded bg-white p-5 shadow">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-900">
                            Filter Notifications
                        </h2>

                        <p className="text-sm text-gray-500">
                            Filter notifications by event or alert type.
                        </p>
                    </div>

                    <form
                        onSubmit={applyFilters}
                        className="grid grid-cols-1 gap-4 md:grid-cols-3"
                    >
                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-700">
                                Event
                            </label>

                            <select
                                value={data.event_id}
                                onChange={(e) =>
                                    setData('event_id', e.target.value)
                                }
                                style={inputStyle()}
                            >
                                <option value="">All Events</option>

                                {safeEvents.map((event) => (
                                    <option key={event.id} value={event.id}>
                                        {event.title}
                                        {event.event_date
                                            ? ` - ${event.event_date}`
                                            : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-700">
                                Notification Type
                            </label>

                            <select
                                value={data.type}
                                onChange={(e) =>
                                    setData('type', e.target.value)
                                }
                                style={inputStyle()}
                            >
                                {Object.entries(filterOptions?.types || {}).map(
                                    ([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    )
                                )}
                            </select>
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
                            Notifications
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Latest reminder and email-related system notifications.
                        </p>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {safeItems.length > 0 ? (
                            safeItems.map((item) => (
                                <NotificationItem
                                    key={`${item.type || 'item'}-${item.id || item.log_id || Math.random()}`}
                                    item={item}
                                />
                            ))
                        ) : (
                            <div className="px-6 py-10 text-center text-sm text-gray-500">
                                No notifications found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function NotificationItem({ item }) {
    const routeExists = (name, params = undefined) => {
        try {
            route(name, params);
            return true;
        } catch (error) {
            return false;
        }
    };

    const markReviewed = () => {
        if (!item.event_id || !item.log_id) {
            alert('Missing event or log ID.');
            return;
        }

        if (!confirm('Mark this failed email notification as reviewed?')) {
            return;
        }

        router.patch(
            route('events.reminder-logs.review', [
                item.event_id,
                item.log_id,
            ]),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const eventShowUrl =
        item.event_id && routeExists('events.show', item.event_id)
            ? route('events.show', item.event_id)
            : null;

    const reminderLogsUrl =
        item.event_id && routeExists('events.reminder-logs.index', item.event_id)
            ? route('events.reminder-logs.index', item.event_id)
            : null;

    const remindersUrl =
        item.event_id && routeExists('events.reminders.index', item.event_id)
            ? route('events.reminders.index', item.event_id)
            : null;

    return (
        <div className="px-6 py-5">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span style={severityBadgeStyle(item.severity)}>
                            {item.type_label || 'Notification'}
                        </span>

                        {item.reminder_type_label && (
                            <span style={lightBadgeStyle()}>
                                {item.reminder_type_label}
                            </span>
                        )}

                        {item.status && (
                            <span style={statusBadgeStyle(item.status)}>
                                {item.status}
                            </span>
                        )}

                        {item.reviewed_at ? (
                            <span style={reviewedBadgeStyle()}>
                                Reviewed
                            </span>
                        ) : item.type === 'failed_emails' ? (
                            <span style={notReviewedBadgeStyle()}>
                                Not Reviewed
                            </span>
                        ) : null}
                    </div>

                    <h3 className="text-base font-bold text-gray-900">
                        {item.title || 'Untitled Notification'}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                        Event:{' '}
                        <span className="font-semibold">
                            {item.event_title || '-'}
                        </span>
                    </p>

                    {item.related_to && item.related_to !== '-' && (
                        <p className="mt-1 text-sm text-gray-600">
                            Related: {item.related_to}
                        </p>
                    )}

                    {item.staff_name && (
                        <p className="mt-1 text-sm text-gray-600">
                            Staff: {item.staff_name}
                        </p>
                    )}

                    {item.recipient_email && (
                        <p className="mt-1 text-sm text-gray-600">
                            Recipient: {item.recipient_email}
                        </p>
                    )}

                    {item.reviewed_at && (
                        <p className="mt-1 text-sm text-green-700">
                            Reviewed at {item.reviewed_at}
                            {item.reviewer_name
                                ? ` by ${item.reviewer_name}`
                                : ''}
                        </p>
                    )}

                    {item.message && (
                        <div
                            className={
                                item.severity === 'danger'
                                    ? 'mt-3 rounded bg-red-50 p-3 text-sm text-red-700'
                                    : 'mt-3 rounded bg-gray-50 p-3 text-sm text-gray-700'
                            }
                        >
                            {item.message}
                        </div>
                    )}

                    <p className="mt-2 text-xs text-gray-500">
                        Time: {item.date_time || '-'}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                    {eventShowUrl && (
                        <Link
                            href={eventShowUrl}
                            style={smallButtonStyle('#4b5563')}
                        >
                            Event
                        </Link>
                    )}

                    {reminderLogsUrl && (
                        <Link
                            href={reminderLogsUrl}
                            style={smallButtonStyle('#7c3aed')}
                        >
                            Logs
                        </Link>
                    )}

                    {remindersUrl && (
                        <Link
                            href={remindersUrl}
                            style={smallButtonStyle('#2563eb')}
                        >
                            Reminders
                        </Link>
                    )}

                    {item.type === 'failed_emails' && !item.reviewed_at && (
                        <button
                            type="button"
                            onClick={markReviewed}
                            style={smallButtonStyle('#16a34a')}
                        >
                            Mark Reviewed
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ label, value, background, color }) {
    return (
        <div
            style={{
                backgroundColor: background,
                borderRadius: '16px',
                padding: '18px',
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
                    fontSize: '30px',
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

function severityBadgeStyle(severity) {
    const styles = {
        success: {
            backgroundColor: '#dcfce7',
            color: '#166534',
        },
        danger: {
            backgroundColor: '#fee2e2',
            color: '#991b1b',
        },
        warning: {
            backgroundColor: '#fef3c7',
            color: '#92400e',
        },
        info: {
            backgroundColor: '#dbeafe',
            color: '#1d4ed8',
        },
    };

    return {
        display: 'inline-flex',
        padding: '4px 10px',
        borderRadius: '999px',
        fontWeight: '700',
        fontSize: '12px',
        ...(styles[severity] || styles.info),
    };
}

function statusBadgeStyle(status) {
    const styles = {
        pending: {
            backgroundColor: '#fef3c7',
            color: '#92400e',
        },
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
        cancelled: {
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
        ...(styles[status] || styles.pending),
    };
}

function lightBadgeStyle() {
    return {
        display: 'inline-flex',
        padding: '4px 10px',
        borderRadius: '999px',
        fontWeight: '700',
        fontSize: '12px',
        backgroundColor: '#f3f4f6',
        color: '#374151',
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
