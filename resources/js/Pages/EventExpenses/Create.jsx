import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth, event, categories, paymentStatuses, vendors }) {
    const { data, setData, post, processing, errors } = useForm({
        vendor_id: '',
        title: '',
        category: 'other',
        description: '',
        estimated_amount: '',
        actual_amount: '',
        paid_amount: '',
        payment_status: 'unpaid',
        expense_date: '',
        vendor_name: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('events.expenses.store', event.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Add Expense - ${event.title}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Add Event Expense
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            {event.title}
                        </p>
                    </div>

                    <Link
                        href={route('events.expenses.index', event.id)}
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
                                Expense Title <span className="text-red-600">*</span>
                            </label>

                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Example: Catering advance payment"
                            />

                            {errors.title && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.title}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Select Vendor
                                </label>

                                <select
                                    value={data.vendor_id}
                                    onChange={(e) => setData('vendor_id', e.target.value)}
                                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">No selected vendor</option>

                                    {vendors.map((vendor) => (
                                        <option key={vendor.id} value={vendor.id}>
                                            {vendor.name}
                                        </option>
                                    ))}
                                </select>

                                {errors.vendor_id && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.vendor_id}
                                    </div>
                                )}

                                {vendors.length === 0 && (
                                    <div className="mt-1 text-xs text-gray-500">
                                        No vendors found. Add vendors first from the Vendors / Suppliers page.
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Manual Vendor Name
                                </label>

                                <input
                                    type="text"
                                    value={data.vendor_name}
                                    onChange={(e) => setData('vendor_name', e.target.value)}
                                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Use only if vendor is not saved"
                                />

                                {errors.vendor_name && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.vendor_name}
                                    </div>
                                )}
                            </div>
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
                                    Payment Status <span className="text-red-600">*</span>
                                </label>

                                <select
                                    value={data.payment_status}
                                    onChange={(e) => setData('payment_status', e.target.value)}
                                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    {paymentStatuses.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>

                                {errors.payment_status && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.payment_status}
                                    </div>
                                )}
                            </div>
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
                                placeholder="Add expense details..."
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
                                    Estimated Amount
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.estimated_amount}
                                    onChange={(e) => setData('estimated_amount', e.target.value)}
                                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="0.00"
                                />

                                {errors.estimated_amount && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.estimated_amount}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Actual Amount
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.actual_amount}
                                    onChange={(e) => setData('actual_amount', e.target.value)}
                                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="0.00"
                                />

                                {errors.actual_amount && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.actual_amount}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Paid Amount
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.paid_amount}
                                    onChange={(e) => setData('paid_amount', e.target.value)}
                                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="0.00"
                                />

                                {errors.paid_amount && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.paid_amount}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                Expense Date
                            </label>

                            <input
                                type="date"
                                value={data.expense_date}
                                onChange={(e) => setData('expense_date', e.target.value)}
                                className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />

                            {errors.expense_date && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.expense_date}
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
                                placeholder="Payment references, bank transfer notes, contact details..."
                            />

                            {errors.notes && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.notes}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <Link
                                href={route('events.expenses.index', event.id)}
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
                                {processing ? 'Saving...' : 'Save Expense'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
