import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ auth, event, schedules, summary }) {
    const { flash } = usePage().props;

    const statusLabel = (status) => {
        if (status === 'pending') return 'Pending';
        if (status === 'ongoing') return 'Ongoing';
        if (status === 'completed') return 'Completed';
        if (status === 'cancelled') return 'Cancelled';

        return status;
    };

    const statusStyle = (status) => {
        if (status === 'completed') {
            return {
                backgroundColor: '#dcfce7',
                color: '#166534',
                padding: '4px 10px',
                borderRadius: '999px',
                fontWeight: '700',
                fontSize: '12px',
            };
        }

        if (status === 'ongoing') {
            return {
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                padding: '4px 10px',
                borderRadius: '999px',
                fontWeight: '700',
                fontSize: '12px',
            };
        }

        if (status === 'cancelled') {
            return {
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                padding: '4px 10px',
                borderRadius: '999px',
                fontWeight: '700',
                fontSize: '12px',
            };
        }

        return {
            backgroundColor: '#fef3c7',
            color: '#92400e',
            padding: '4px 10px',
            borderRadius: '999px',
            fontWeight: '700',
            fontSize: '12px',
        };
    };

    const formatTime = (time) => {
        if (!time) {
            return '-';
        }

        return time.slice(0, 5);
    };

    const completeSchedule = (scheduleId) => {
        router.patch(route('events.schedules.complete', [event.id, scheduleId]), {}, {
            preserveScroll: true,
        });
    };

    const deleteSchedule = (scheduleId) => {
        if (!confirm('Are you sure you want to delete this schedule item?')) {
            return;
        }

        router.delete(route('events.schedules.destroy', [event.id, scheduleId]), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Schedule - ${event.title}`} />

            <div className="p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Event Schedule / Timeline
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            {event.title}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={route('events.show', event.id)}
                            style={{
                                display: 'inline-flex',
                                backgroundColor: '#6b7280',
                                color: '#ffffff',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                fontWeight: '700',
                                textDecoration: 'none',
                            }}
                        >
                            Back to Event
                        </Link>

                        <Link
                            href={route('events.schedules.create', event.id)}
                            style={{
                                display: 'inline-flex',
                                backgroundColor: '#2563eb',
                                color: '#ffffff',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                fontWeight: '700',
                                textDecoration: 'none',
                            }}
                        >
                            Add Schedule Item
                        </Link>
                    </div>
                </div>

                {flash?.success && (
                    <div className="mb-4 rounded border border-green-200 bg-green-50 p-4 text-green-800">
                        {flash.success}
                    </div>
                )}

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
                    <div className="rounded bg-white p-5 shadow">
                        <div className="text-sm font-semibold text-gray-500">
                            Total Items
                        </div>
                        <div className="mt-2 text-3xl font-bold text-gray-900">
                            {summary.total}
                        </div>
                    </div>

                    <div className="rounded bg-white p-5 shadow">
                        <div className="text-sm font-semibold text-gray-500">
                            Pending
                        </div>
                        <div className="mt-2 text-3xl font-bold text-yellow-700">
                            {summary.pending}
                        </div>
                    </div>

                    <div className="rounded bg-white p-5 shadow">
                        <div className="text-sm font-semibold text-gray-500">
                            Ongoing
                        </div>
                        <div className="mt-2 text-3xl font-bold text-blue-700">
                            {summary.ongoing}
                        </div>
                    </div>

                    <div className="rounded bg-white p-5 shadow">
                        <div className="text-sm font-semibold text-gray-500">
                            Completed
                        </div>
                        <div className="mt-2 text-3xl font-bold text-green-700">
                            {summary.completed}
                        </div>
                    </div>

                    <div className="rounded bg-white p-5 shadow">
                        <div className="text-sm font-semibold text-gray-500">
                            Cancelled
                        </div>
                        <div className="mt-2 text-3xl font-bold text-red-700">
                            {summary.cancelled}
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Order
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Date / Time
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Title
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Location
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Assigned Staff
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white">
                            {schedules.length > 0 ? (
                                schedules.map((schedule) => (
                                    <tr key={schedule.id}>
                                        <td className="px-4 py-4 align-top text-sm font-semibold text-gray-700">
                                            {schedule.sort_order}
                                        </td>

                                        <td className="px-4 py-4 align-top text-sm text-gray-700">
                                            <div className="font-semibold text-gray-900">
                                                {schedule.schedule_date || '-'}
                                            </div>
                                            <div className="mt-1 text-xs text-gray-500">
                                                {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 align-top">
                                            <div className="font-semibold text-gray-900">
                                                {schedule.title}
                                            </div>

                                            {schedule.description && (
                                                <div className="mt-1 max-w-md text-sm text-gray-500">
                                                    {schedule.description}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 py-4 align-top text-sm text-gray-700">
                                            {schedule.location || '-'}
                                        </td>

                                        <td className="px-4 py-4 align-top text-sm text-gray-700">
                                            {schedule.staff ? (
                                                <div>
                                                    <div className="font-semibold text-gray-900">
                                                        {schedule.staff.name}
                                                    </div>

                                                    {schedule.staff.role && (
                                                        <div className="text-xs text-gray-500">
                                                            {schedule.staff.role}
                                                        </div>
                                                    )}

                                                    {schedule.staff.phone && (
                                                        <div className="text-xs text-gray-500">
                                                            {schedule.staff.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : schedule.assigned_to ? (
                                                <div>
                                                    <div className="font-semibold text-gray-700">
                                                        {schedule.assigned_to}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Manual assignment
                                                    </div>
                                                </div>
                                            ) : (
                                                '-'
                                            )}
                                        </td>

                                        <td className="px-4 py-4 align-top">
                                            <span style={statusStyle(schedule.status)}>
                                                {statusLabel(schedule.status)}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 align-top">
                                            <div className="flex flex-wrap justify-end gap-2">
                                                {schedule.status !== 'completed' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => completeSchedule(schedule.id)}
                                                        style={{
                                                            backgroundColor: '#16a34a',
                                                            color: '#ffffff',
                                                            padding: '8px 12px',
                                                            borderRadius: '8px',
                                                            fontWeight: '700',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        Mark Completed
                                                    </button>
                                                )}

                                                <Link
                                                    href={route('events.schedules.edit', [
                                                        event.id,
                                                        schedule.id,
                                                    ])}
                                                    style={{
                                                        display: 'inline-flex',
                                                        backgroundColor: '#f59e0b',
                                                        color: '#111827',
                                                        padding: '8px 12px',
                                                        borderRadius: '8px',
                                                        fontWeight: '700',
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => deleteSchedule(schedule.id)}
                                                    style={{
                                                        backgroundColor: '#dc2626',
                                                        color: '#ffffff',
                                                        padding: '8px 12px',
                                                        borderRadius: '8px',
                                                        fontWeight: '700',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-4 py-10 text-center text-gray-500"
                                    >
                                        No schedule items found. The event currently has no timeline, which is brave in the same way walking into traffic is brave.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
