import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, event, schedule, statuses }) {
    const { data, setData, put, processing, errors } = useForm({
        title: schedule.title || '',
        description: schedule.description || '',
        schedule_date: schedule.schedule_date || '',
        start_time: schedule.start_time || '',
        end_time: schedule.end_time || '',
        location: schedule.location || '',
        assigned_to: schedule.assigned_to || '',
        status: schedule.status || 'pending',
        sort_order: schedule.sort_order || 0,
    });

    const submit = (e) => {
        e.preventDefault();

        put(route('events.schedules.update', [event.id, schedule.id]));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Edit Schedule - ${event.title}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Edit Schedule Item
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            {event.title}
                        </p>
                    </div>

                    <Link
                        href={route('events.schedules.index', event.id)}
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
                        Back
                    </Link>
                </div>

                <div className="rounded bg-white p-6 shadow">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                Title <span className="text-red-600">*</span>
                            </label>

                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />

                            {errors.title && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.title}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                Description
                            </label>

                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows="3"
                            />

                            {errors.description && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.description}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Schedule Date
                                </label>

                                <input
                                    type="date"
                                    value={data.schedule_date}
                                    onChange={(e) => setData('schedule_date', e.target.value)}
                                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />

                                {errors.schedule_date && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.schedule_date}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Start Time
                                </label>

                                <input
                                    type="time"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />

                                {errors.start_time && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.start_time}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    End Time
                                </label>

                                <input
                                    type="time"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />

                                {errors.end_time && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.end_time}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Location
                                </label>

                                <input
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />

                                {errors.location && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.location}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Assigned To
                                </label>

                                <input
                                    type="text"
                                    value={data.assigned_to}
                                    onChange={(e) => setData('assigned_to', e.target.value)}
                                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />

                                {errors.assigned_to && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.assigned_to}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Status <span className="text-red-600">*</span>
                                </label>

                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    {statuses.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>

                                {errors.status && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.status}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Sort Order
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', e.target.value)}
                                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />

                                {errors.sort_order && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.sort_order}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Link
                                href={route('events.schedules.index', event.id)}
                                style={{
                                    display: 'inline-flex',
                                    backgroundColor: '#e5e7eb',
                                    color: '#111827',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                }}
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    backgroundColor: processing ? '#93c5fd' : '#2563eb',
                                    color: '#ffffff',
                                    padding: '10px 18px',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    border: 'none',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {processing ? 'Updating...' : 'Update Schedule'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
