import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth, event }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        due_date: '',
        assigned_to: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('events.tasks.store', event.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Create Task - ${event.title}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Create Planning Task
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            {event.title}
                        </p>
                    </div>

                    <Link
                        href={route('events.tasks.index', event.id)}
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
                                placeholder="Example: Confirm catering menu"
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
                                rows="4"
                                placeholder="Add task details..."
                            />

                            {errors.description && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.description}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Priority <span className="text-red-600">*</span>
                                </label>

                                <select
                                    value={data.priority}
                                    onChange={(e) => setData('priority', e.target.value)}
                                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>

                                {errors.priority && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.priority}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Status <span className="text-red-600">*</span>
                                </label>

                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>

                                {errors.status && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.status}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Due Date
                                </label>

                                <input
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />

                                {errors.due_date && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.due_date}
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
                                    placeholder="Example: Event staff / John / Catering team"
                                />

                                {errors.assigned_to && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.assigned_to}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Link
                                href={route('events.tasks.index', event.id)}
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
                                {processing ? 'Saving...' : 'Save Task'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
