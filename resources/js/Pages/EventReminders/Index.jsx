import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ auth, event, reminders, summary }) {
    const { flash } = usePage().props;

    const buttonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2563eb',
        color: '#ffffff',
        padding: '10px 16px',
        borderRadius: '8px',
        fontWeight: '700',
        textDecoration: 'none',
        border: 'none',
        cursor: 'pointer',
    };

    const greenButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#16a34a',
        padding: '7px 10px',
        fontSize: '13px',
    };

    const orangeButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#f97316',
        padding: '7px 10px',
        fontSize: '13px',
    };

    const redButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#dc2626',
        padding: '7px 10px',
        fontSize: '13px',
    };

    const grayButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#4b5563',
        padding: '7px 10px',
        fontSize: '13px',
    };

    const cardStyle = {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '18px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    };

    const getStatusBadge = (status) => {
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
    };

    const getRelatedTo = (reminder) => {
        if (reminder.task) {
            return `Task: ${reminder.task.title}`;
        }

        if (reminder.schedule) {
            return `Schedule: ${reminder.schedule.title}`;
        }

        return '-';
    };

    const markSent = (reminderId) => {
        if (confirm('Mark this reminder as sent?')) {
            router.patch(route('events.reminders.sent', [event.id, reminderId]));
        }
    };

    const cancelReminder = (reminderId) => {
        if (confirm('Cancel this reminder?')) {
            router.patch(route('events.reminders.cancel', [event.id, reminderId]));
        }
    };

    const deleteReminder = (reminderId) => {
        if (confirm('Delete this reminder? This cannot be undone.')) {
            router.delete(route('events.reminders.destroy', [event.id, reminderId]));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Reminders - ${event.title}`} />

            <div className="p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Event Reminders
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            {event.title}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={route('events.show', event.id)}
                            style={{
                                ...buttonStyle,
                                backgroundColor: '#4b5563',
                            }}
                        >
                            Back to Event
                        </Link>

                        <Link
                            href={route('events.reminders.create', event.id)}
                            style={buttonStyle}
                        >
                            Add Reminder
                        </Link>
                    </div>
                </div>

                {flash?.success && (
                    <div className="mb-4 rounded bg-green-100 px-4 py-3 font-semibold text-green-800">
                        {flash.success}
                    </div>
                )}

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
                    <div style={cardStyle}>
                        <div className="text-sm font-semibold text-gray-500">
                            Total Reminders
                        </div>
                        <div className="mt-2 text-2xl font-bold text-gray-900">
                            {summary.total}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <div className="text-sm font-semibold text-gray-500">
                            Pending
                        </div>
                        <div className="mt-2 text-2xl font-bold text-yellow-700">
                            {summary.pending}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <div className="text-sm font-semibold text-gray-500">
                            Sent
                        </div>
                        <div className="mt-2 text-2xl font-bold text-green-700">
                            {summary.sent}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <div className="text-sm font-semibold text-gray-500">
                            Cancelled
                        </div>
                        <div className="mt-2 text-2xl font-bold text-red-700">
                            {summary.cancelled}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <div className="text-sm font-semibold text-gray-500">
                            Upcoming
                        </div>
                        <div className="mt-2 text-2xl font-bold text-blue-700">
                            {summary.upcoming}
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded bg-white shadow">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                            <tr>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Related To</th>
                                <th className="px-4 py-3">Assigned Staff</th>
                                <th className="px-4 py-3">Remind At</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reminders.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-4 py-8 text-center text-gray-500"
                                    >
                                        No reminders found. Apparently even reminders need reminding.
                                    </td>
                                </tr>
                            )}

                            {reminders.map((reminder) => (
                                <tr
                                    key={reminder.id}
                                    className="border-t align-top"
                                >
                                    <td className="px-4 py-3">
                                        <div className="font-bold text-gray-900">
                                            {reminder.title}
                                        </div>
                                        {reminder.message && (
                                            <div className="mt-1 max-w-xs text-xs text-gray-500">
                                                {reminder.message}
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-4 py-3">
                                        {reminder.reminder_type_label}
                                    </td>

                                    <td className="px-4 py-3">
                                        {getRelatedTo(reminder)}
                                    </td>

                                    <td className="px-4 py-3">
                                        {reminder.staff ? (
                                            <div>
                                                <div className="font-semibold">
                                                    {reminder.staff.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {reminder.staff.role}
                                                </div>
                                            </div>
                                        ) : (
                                            '-'
                                        )}
                                    </td>

                                    <td className="px-4 py-3">
                                        {reminder.remind_at}
                                    </td>

                                    <td className="px-4 py-3">
                                        <span style={getStatusBadge(reminder.status)}>
                                            {reminder.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-2">
                                            <Link
                                                href={route('events.reminders.edit', [
                                                    event.id,
                                                    reminder.id,
                                                ])}
                                                style={grayButtonStyle}
                                            >
                                                Edit
                                            </Link>

                                            <Link
                                                href={route('events.reminders.logs', [
                                                    event.id,
                                                    reminder.id,
                                                ])}
                                                style={{
                                                    ...grayButtonStyle,
                                                    backgroundColor: '#7c3aed',
                                                }}
                                            >
                                                Logs
                                            </Link>

                                            {reminder.status !== 'sent' && (
                                                <button
                                                    type="button"
                                                    onClick={() => markSent(reminder.id)}
                                                    style={greenButtonStyle}
                                                >
                                                    Mark Sent
                                                </button>
                                            )}

                                            {reminder.status !== 'cancelled' && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        cancelReminder(reminder.id)
                                                    }
                                                    style={orangeButtonStyle}
                                                >
                                                    Cancel
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => deleteReminder(reminder.id)}
                                                style={redButtonStyle}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
