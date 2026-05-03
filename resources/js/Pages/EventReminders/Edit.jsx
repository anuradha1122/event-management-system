import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({
    auth,
    event,
    reminder,
    tasks,
    schedules,
    staffMembers,
    reminderTypes,
    statuses,
}) {
    const { data, setData, put, processing, errors } = useForm({
        title: reminder.title || '',
        message: reminder.message || '',
        reminder_type: reminder.reminder_type || 'general',
        task_id: reminder.task_id || '',
        schedule_id: reminder.schedule_id || '',
        staff_id: reminder.staff_id || '',
        remind_at: reminder.remind_at || '',
        status: reminder.status || 'pending',
    });

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

    const labelStyle = {
        display: 'block',
        marginBottom: '6px',
        fontWeight: '700',
        color: '#374151',
    };

    const inputStyle = {
        width: '100%',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '10px',
    };

    const errorStyle = {
        marginTop: '4px',
        color: '#dc2626',
        fontSize: '13px',
        fontWeight: '600',
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('events.reminders.update', [event.id, reminder.id]));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Edit Reminder - ${event.title}`} />

            <div className="p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Edit Reminder
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            {event.title}
                        </p>
                    </div>

                    <Link
                        href={route('events.reminders.index', event.id)}
                        style={{
                            ...buttonStyle,
                            backgroundColor: '#4b5563',
                        }}
                    >
                        Back to Reminders
                    </Link>
                </div>

                <form
                    onSubmit={submit}
                    className="max-w-3xl rounded bg-white p-6 shadow"
                >
                    <div className="mb-4">
                        <label style={labelStyle}>Title *</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            style={inputStyle}
                        />
                        {errors.title && (
                            <div style={errorStyle}>{errors.title}</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label style={labelStyle}>Message</label>
                        <textarea
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            style={inputStyle}
                            rows="4"
                        />
                        {errors.message && (
                            <div style={errorStyle}>{errors.message}</div>
                        )}
                    </div>

                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label style={labelStyle}>Reminder Type *</label>
                            <select
                                value={data.reminder_type}
                                onChange={(e) =>
                                    setData('reminder_type', e.target.value)
                                }
                                style={inputStyle}
                            >
                                {Object.entries(reminderTypes).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            {errors.reminder_type && (
                                <div style={errorStyle}>
                                    {errors.reminder_type}
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={labelStyle}>Status *</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                style={inputStyle}
                            >
                                {Object.entries(statuses).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            {errors.status && (
                                <div style={errorStyle}>{errors.status}</div>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label style={labelStyle}>Remind At *</label>
                        <input
                            type="datetime-local"
                            value={data.remind_at}
                            onChange={(e) => setData('remind_at', e.target.value)}
                            style={inputStyle}
                        />
                        {errors.remind_at && (
                            <div style={errorStyle}>{errors.remind_at}</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label style={labelStyle}>Related Task</label>
                        <select
                            value={data.task_id}
                            onChange={(e) => setData('task_id', e.target.value)}
                            style={inputStyle}
                        >
                            <option value="">No related task</option>
                            {tasks.map((task) => (
                                <option key={task.id} value={task.id}>
                                    {task.title} ({task.status})
                                </option>
                            ))}
                        </select>
                        {errors.task_id && (
                            <div style={errorStyle}>{errors.task_id}</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label style={labelStyle}>Related Schedule Item</label>
                        <select
                            value={data.schedule_id}
                            onChange={(e) =>
                                setData('schedule_id', e.target.value)
                            }
                            style={inputStyle}
                        >
                            <option value="">No related schedule item</option>
                            {schedules.map((schedule) => (
                                <option key={schedule.id} value={schedule.id}>
                                    {schedule.title}
                                    {schedule.schedule_date
                                        ? ` - ${schedule.schedule_date}`
                                        : ''}
                                    {schedule.start_time
                                        ? ` ${schedule.start_time}`
                                        : ''}
                                </option>
                            ))}
                        </select>
                        {errors.schedule_id && (
                            <div style={errorStyle}>{errors.schedule_id}</div>
                        )}
                    </div>

                    <div className="mb-6">
                        <label style={labelStyle}>Assigned Staff</label>
                        <select
                            value={data.staff_id}
                            onChange={(e) => setData('staff_id', e.target.value)}
                            style={inputStyle}
                        >
                            <option value="">No assigned staff</option>
                            {staffMembers.map((staff) => (
                                <option key={staff.id} value={staff.id}>
                                    {staff.name}
                                    {staff.role ? ` - ${staff.role}` : ''}
                                </option>
                            ))}
                        </select>
                        {errors.staff_id && (
                            <div style={errorStyle}>{errors.staff_id}</div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                ...buttonStyle,
                                opacity: processing ? 0.7 : 1,
                            }}
                        >
                            Update Reminder
                        </button>

                        <Link
                            href={route('events.reminders.index', event.id)}
                            style={{
                                ...buttonStyle,
                                backgroundColor: '#6b7280',
                            }}
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
