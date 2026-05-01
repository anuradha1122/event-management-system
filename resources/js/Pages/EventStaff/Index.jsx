import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ auth, event, staff, summary }) {
    const { flash } = usePage().props;

    const statusLabel = (status) => {
        if (status === 'active') return 'Active';
        if (status === 'inactive') return 'Inactive';

        return status;
    };

    const statusStyle = (status) => {
        if (status === 'active') {
            return {
                backgroundColor: '#dcfce7',
                color: '#166534',
                padding: '4px 10px',
                borderRadius: '999px',
                fontWeight: '700',
                fontSize: '12px',
            };
        }

        return {
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '4px 10px',
            borderRadius: '999px',
            fontWeight: '700',
            fontSize: '12px',
        };
    };

    const roleStyle = () => {
        return {
            backgroundColor: '#e0f2fe',
            color: '#075985',
            padding: '4px 10px',
            borderRadius: '999px',
            fontWeight: '700',
            fontSize: '12px',
        };
    };

    const deleteStaff = (staffId) => {
        if (!confirm('Are you sure you want to delete this staff member?')) {
            return;
        }

        router.delete(route('events.staff.destroy', [event.id, staffId]), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Staff - ${event.title}`} />

            <div className="p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Event Staff Assignment
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
                            href={route('events.staff.create', event.id)}
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
                            Add Staff
                        </Link>
                    </div>
                </div>

                {flash?.success && (
                    <div className="mb-4 rounded border border-green-200 bg-green-50 p-4 text-green-800">
                        {flash.success}
                    </div>
                )}

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded bg-white p-5 shadow">
                        <div className="text-sm font-semibold text-gray-500">
                            Total Staff
                        </div>
                        <div className="mt-2 text-3xl font-bold text-gray-900">
                            {summary.total}
                        </div>
                    </div>

                    <div className="rounded bg-white p-5 shadow">
                        <div className="text-sm font-semibold text-gray-500">
                            Active
                        </div>
                        <div className="mt-2 text-3xl font-bold text-green-700">
                            {summary.active}
                        </div>
                    </div>

                    <div className="rounded bg-white p-5 shadow">
                        <div className="text-sm font-semibold text-gray-500">
                            Inactive
                        </div>
                        <div className="mt-2 text-3xl font-bold text-red-700">
                            {summary.inactive}
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Role
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Phone
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Email
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
                            {staff.length > 0 ? (
                                staff.map((staffMember) => (
                                    <tr key={staffMember.id}>
                                        <td className="px-4 py-4 align-top">
                                            <div className="font-semibold text-gray-900">
                                                {staffMember.name}
                                            </div>

                                            {staffMember.notes && (
                                                <div className="mt-1 max-w-sm text-xs text-gray-500">
                                                    Notes: {staffMember.notes}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 py-4 align-top">
                                            {staffMember.role ? (
                                                <span style={roleStyle()}>
                                                    {staffMember.role}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-gray-500">-</span>
                                            )}
                                        </td>

                                        <td className="px-4 py-4 align-top text-sm text-gray-700">
                                            {staffMember.phone || '-'}
                                        </td>

                                        <td className="px-4 py-4 align-top text-sm text-gray-700">
                                            {staffMember.email || '-'}
                                        </td>

                                        <td className="px-4 py-4 align-top">
                                            <span style={statusStyle(staffMember.status)}>
                                                {statusLabel(staffMember.status)}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 align-top">
                                            <div className="flex flex-wrap justify-end gap-2">
                                                <Link
                                                    href={route('events.staff.edit', [
                                                        event.id,
                                                        staffMember.id,
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
                                                    onClick={() => deleteStaff(staffMember.id)}
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
                                        No staff members found. The event is apparently organizing itself, which is adorable and doomed.
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
