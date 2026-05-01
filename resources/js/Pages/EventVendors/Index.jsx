import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ auth, event, vendors, summary }) {
    const { flash } = usePage().props;

    const categoryLabel = (category) => {
        const labels = {
            venue: 'Venue',
            food: 'Food / Catering',
            decoration: 'Decoration',
            photography: 'Photography',
            music: 'Music / DJ',
            transport: 'Transport',
            printing: 'Printing',
            gift: 'Gift Items',
            other: 'Other',
        };

        return labels[category] || category;
    };

    const statusLabel = (status) => {
        if (status === 'pending') return 'Pending';
        if (status === 'confirmed') return 'Confirmed';
        if (status === 'cancelled') return 'Cancelled';

        return status;
    };

    const statusStyle = (status) => {
        if (status === 'confirmed') {
            return {
                backgroundColor: '#dcfce7',
                color: '#166534',
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

    const categoryStyle = () => {
        return {
            backgroundColor: '#e0f2fe',
            color: '#075985',
            padding: '4px 10px',
            borderRadius: '999px',
            fontWeight: '700',
            fontSize: '12px',
        };
    };

    const deleteVendor = (vendorId) => {
        if (!confirm('Are you sure you want to delete this vendor?')) {
            return;
        }

        router.delete(route('events.vendors.destroy', [event.id, vendorId]), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Vendors - ${event.title}`} />

            <div className="p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Event Vendors / Suppliers
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
                            href={route('events.vendors.create', event.id)}
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
                            Add Vendor
                        </Link>
                    </div>
                </div>

                {flash?.success && (
                    <div className="mb-4 rounded border border-green-200 bg-green-50 p-4 text-green-800">
                        {flash.success}
                    </div>
                )}

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="rounded bg-white p-5 shadow">
                        <div className="text-sm font-semibold text-gray-500">
                            Total Vendors
                        </div>
                        <div className="mt-2 text-3xl font-bold text-gray-900">
                            {summary.total}
                        </div>
                    </div>

                    <div className="rounded bg-white p-5 shadow">
                        <div className="text-sm font-semibold text-gray-500">
                            Confirmed
                        </div>
                        <div className="mt-2 text-3xl font-bold text-green-700">
                            {summary.confirmed}
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
                                    Vendor Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Contact Person
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
                            {vendors.length > 0 ? (
                                vendors.map((vendor) => (
                                    <tr key={vendor.id}>
                                        <td className="px-4 py-4 align-top">
                                            <div className="font-semibold text-gray-900">
                                                {vendor.name}
                                            </div>

                                            {vendor.address && (
                                                <div className="mt-1 max-w-sm text-sm text-gray-500">
                                                    {vendor.address}
                                                </div>
                                            )}

                                            {vendor.notes && (
                                                <div className="mt-1 max-w-sm text-xs text-gray-500">
                                                    Notes: {vendor.notes}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 py-4 align-top">
                                            <span style={categoryStyle()}>
                                                {categoryLabel(vendor.category)}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 align-top text-sm text-gray-700">
                                            {vendor.contact_person || '-'}
                                        </td>

                                        <td className="px-4 py-4 align-top text-sm text-gray-700">
                                            {vendor.phone || '-'}
                                        </td>

                                        <td className="px-4 py-4 align-top text-sm text-gray-700">
                                            {vendor.email || '-'}
                                        </td>

                                        <td className="px-4 py-4 align-top">
                                            <span style={statusStyle(vendor.status)}>
                                                {statusLabel(vendor.status)}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 align-top">
                                            <div className="flex flex-wrap justify-end gap-2">
                                                <Link
                                                    href={route('events.vendors.edit', [
                                                        event.id,
                                                        vendor.id,
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
                                                    onClick={() => deleteVendor(vendor.id)}
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
                                        No vendors found. The event has no suppliers yet, which is either peaceful or deeply suspicious.
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
