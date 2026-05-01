import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ auth, event, tasks, summary }) {
    const { flash } = usePage().props;

    const statusLabel = (status) => {
        if (status === 'pending') return 'Pending';
        if (status === 'in_progress') return 'In Progress';
        if (status === 'done') return 'Done';
        return status;
    };

    const priorityStyle = (priority) => {
        if (priority === 'high') {
            return {
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                padding: '4px 10px',
                borderRadius: '999px',
                fontWeight: '700',
                fontSize: '12px',
            };
        }

        if (priority === 'medium') {
            return {
                backgroundColor: '#fef3c7',
                color: '#92400e',
                padding: '4px 10px',
                borderRadius: '999px',
                fontWeight: '700',
                fontSize: '12px',
            };
        }

        return {
            backgroundColor: '#dcfce7',
            color: '#166534',
            padding: '4px 10px',
            borderRadius: '999px',
            fontWeight: '700',
            fontSize: '12px',
        };
    };

    const statusStyle = (status) => {
        if (status === 'done') {
            return {
                backgroundColor: '#dcfce7',
                color: '#166534',
                padding: '4px 10px',
                borderRadius: '999px',
                fontWeight: '700',
                fontSize: '12px',
            };
        }

        if (status === 'in_progress') {
            return {
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                padding: '4px 10px',
                borderRadius: '999px',
                fontWeight: '700',
                fontSize: '12px',
            };
        }

        return {
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '4px 10px',
            borderRadius: '999px',
            fontWeight: '700',
            fontSize: '12px',
        };
    };

    const markDone = (taskId) => {
        router.patch(route('events.tasks.done', [event.id, taskId]), {}, {
            preserveScroll: true,
        });
    };

    const deleteTask = (taskId) => {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        router.delete(route('events.tasks.destroy', [event.id, taskId]), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Planning Tasks - ${event.title}`} />

            <div className="p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Event Planning Tasks
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
                            href={route('events.tasks.create', event.id)}
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
                            Add Task
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
                        <div className="text-sm font-semibold text-gray-500">Total Tasks</div>
                        <div className="mt-2 text-3xl font-bold text-gray-900">
                            {summary.total}
                        </div>
                    </div>

                    <div className="rounded bg-white p-5 shadow">
                        <div className="text-sm font-semibold text-gray-500">Pending</div>
                        <div className="mt-2 text-3xl font-bold text-gray-900">
                            {summary.pending}
                        </div>
                    </div>

                    <div className="rounded bg-white p-5 shadow">
                        <div className="text-sm font-semibold text-gray-500">In Progress</div>
                        <div className="mt-2 text-3xl font-bold text-blue-700">
                            {summary.in_progress}
                        </div>
                    </div>

                    <div className="rounded bg-white p-5 shadow">
                        <div className="text-sm font-semibold text-gray-500">Done</div>
                        <div className="mt-2 text-3xl font-bold text-green-700">
                            {summary.done}
                        </div>
                    </div>

                    <div className="rounded bg-white p-5 shadow">
                        <div className="text-sm font-semibold text-gray-500">Completion</div>
                        <div className="mt-2 text-3xl font-bold text-purple-700">
                            {summary.completion_percentage}%
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Task
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Priority
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Due Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Assigned To
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white">
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <tr key={task.id}>
                                        <td className="px-4 py-4 align-top">
                                            <div className="font-semibold text-gray-900">
                                                {task.title}
                                            </div>

                                            {task.description && (
                                                <div className="mt-1 max-w-xl text-sm text-gray-600">
                                                    {task.description}
                                                </div>
                                            )}

                                            {task.completed_at && (
                                                <div className="mt-1 text-xs text-green-700">
                                                    Completed: {task.completed_at}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 py-4 align-top">
                                            <span style={priorityStyle(task.priority)}>
                                                {task.priority}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 align-top">
                                            <span style={statusStyle(task.status)}>
                                                {statusLabel(task.status)}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 align-top text-sm text-gray-700">
                                            {task.due_date || '-'}
                                        </td>

                                        <td className="px-4 py-4 align-top text-sm text-gray-700">
                                            {task.assigned_to || '-'}
                                        </td>

                                        <td className="px-4 py-4 align-top">
                                            <div className="flex flex-wrap justify-end gap-2">
                                                {task.status !== 'done' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => markDone(task.id)}
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
                                                        Mark Done
                                                    </button>
                                                )}

                                                <Link
                                                    href={route('events.tasks.edit', [event.id, task.id])}
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
                                                    onClick={() => deleteTask(task.id)}
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
                                        colSpan="6"
                                        className="px-4 py-10 text-center text-gray-500"
                                    >
                                        No planning tasks found. Add one before the event chaos starts multiplying.
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
