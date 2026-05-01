import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth, event, categories, statuses }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category: 'other',
        contact_person: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
        status: 'pending',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('events.vendors.store', event.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Add Vendor - ${event.title}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Add Event Vendor
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            {event.title}
                        </p>
                    </div>

                    <Link
                        href={route('events.vendors.index', event.id)}
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
                                Vendor Name <span className="text-red-600">*</span>
                            </label>

                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Example: ABC Catering Service"
                            />

                            {errors.name && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Category <span className="text-red-600">*</span>
                                </label>

                                <select
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    {categories.map((category) => (
                                        <option key={category.value} value={category.value}>
                                            {category.label}
                                        </option>
                                    ))}
                                </select>

                                {errors.category && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.category}
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
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                Contact Person
                            </label>

                            <input
                                type="text"
                                value={data.contact_person}
                                onChange={(e) => setData('contact_person', e.target.value)}
                                className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Example: Mr. Perera"
                            />

                            {errors.contact_person && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.contact_person}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Example: 0771234567"
                                />

                                {errors.phone && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.phone}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Example: vendor@example.com"
                                />

                                {errors.email && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.email}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                Address
                            </label>

                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows="3"
                                placeholder="Vendor address..."
                            />

                            {errors.address && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.address}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                Notes
                            </label>

                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows="3"
                                placeholder="Contract details, payment notes, special instructions..."
                            />

                            {errors.notes && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.notes}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <Link
                                href={route('events.vendors.index', event.id)}
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
                                {processing ? 'Saving...' : 'Save Vendor'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
