import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ auth, event, expenses, summary }) {
    const { flash } = usePage().props;

    const money = (value) => {
        const number = Number(value || 0);

        return `Rs. ${number.toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

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

    const paymentStatusLabel = (status) => {
        if (status === 'unpaid') return 'Unpaid';
        if (status === 'partial') return 'Partial';
        if (status === 'paid') return 'Paid';
        return status;
    };

    const paymentStatusStyle = (status) => {
        if (status === 'paid') {
            return {
                backgroundColor: '#dcfce7',
                color: '#166534',
                padding: '4px 10px',
                borderRadius: '999px',
                fontWeight: '700',
                fontSize: '12px',
            };
        }

        if (status === 'partial') {
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
            backgroundColor: '#fee2e2',
            color: '#991b1b',
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

    const deleteExpense = (expenseId) => {
        if (!confirm('Are you sure you want to delete this expense?')) {
            return;
        }

        router.delete(route('events.expenses.destroy', [event.id, expenseId]), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Event Budget - ${event.title}`} />

            <div className="p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Event Budget / Expenses
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
                            href={route('events.expenses.create', event.id)}
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
                            Add Expense
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
                            Estimated Budget
                        </div>
                        <div className="mt-2 text-xl font-bold text-gray-900">
                            {money(summary.total_estimated)}
                        </div>
                    </div>

                    <div className="rounded bg-white p-5 shadow">
                        <div className="text-sm font-semibold text-gray-500">
                            Actual Expense
                        </div>
                        <div className="mt-2 text-xl font-bold text-red-700">
                            {money(summary.total_actual)}
                        </div>
                    </div>

                    <div className="rounded bg-white p-5 shadow">
                        <div className="text-sm font-semibold text-gray-500">
                            Total Paid
                        </div>
                        <div className="mt-2 text-xl font-bold text-green-700">
                            {money(summary.total_paid)}
                        </div>
                    </div>

                    <div className="rounded bg-white p-5 shadow">
                        <div className="text-sm font-semibold text-gray-500">
                            Pending
                        </div>
                        <div className="mt-2 text-xl font-bold text-orange-700">
                            {money(summary.total_pending)}
                        </div>
                    </div>

                    <div className="rounded bg-white p-5 shadow">
                        <div className="text-sm font-semibold text-gray-500">
                            Balance / Difference
                        </div>
                        <div
                            className={`mt-2 text-xl font-bold ${
                                Number(summary.balance_difference) >= 0
                                    ? 'text-green-700'
                                    : 'text-red-700'
                            }`}
                        >
                            {money(summary.balance_difference)}
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Expense
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Vendor
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Estimated
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Actual
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Paid
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Date
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white">
                            {expenses.length > 0 ? (
                                expenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td className="px-4 py-4 align-top">
                                            <div className="font-semibold text-gray-900">
                                                {expense.title}
                                            </div>

                                            {expense.description && (
                                                <div className="mt-1 max-w-sm text-sm text-gray-500">
                                                    {expense.description}
                                                </div>
                                            )}

                                            {expense.notes && (
                                                <div className="mt-1 max-w-sm text-xs text-gray-500">
                                                    Notes: {expense.notes}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 py-4 align-top text-sm text-gray-700">
                                            {expense.vendor ? (
                                                <div>
                                                    <div className="font-semibold text-gray-900">
                                                        {expense.vendor.name}
                                                    </div>

                                                    {expense.vendor.phone && (
                                                        <div className="text-xs text-gray-500">
                                                            {expense.vendor.phone}
                                                        </div>
                                                    )}

                                                    {expense.vendor.email && (
                                                        <div className="text-xs text-gray-500">
                                                            {expense.vendor.email}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : expense.vendor_name ? (
                                                <div>
                                                    <div className="font-semibold text-gray-700">
                                                        {expense.vendor_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Manual vendor name
                                                    </div>
                                                </div>
                                            ) : (
                                                '-'
                                            )}
                                        </td>

                                        <td className="px-4 py-4 align-top">
                                            <span style={categoryStyle()}>
                                                {categoryLabel(expense.category)}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 text-right align-top text-sm text-gray-700">
                                            {money(expense.estimated_amount)}
                                        </td>

                                        <td className="px-4 py-4 text-right align-top text-sm font-semibold text-gray-900">
                                            {money(expense.actual_amount)}
                                        </td>

                                        <td className="px-4 py-4 text-right align-top text-sm text-green-700">
                                            {money(expense.paid_amount)}
                                        </td>

                                        <td className="px-4 py-4 align-top">
                                            <span style={paymentStatusStyle(expense.payment_status)}>
                                                {paymentStatusLabel(expense.payment_status)}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 align-top text-sm text-gray-700">
                                            {expense.expense_date || '-'}
                                        </td>

                                        <td className="px-4 py-4 align-top">
                                            <div className="flex flex-wrap justify-end gap-2">
                                                <Link
                                                    href={route('events.expenses.edit', [
                                                        event.id,
                                                        expense.id,
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
                                                    onClick={() => deleteExpense(expense.id)}
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
                                        colSpan="9"
                                        className="px-4 py-10 text-center text-gray-500"
                                    >
                                        No expenses found. The budget is still innocent. That will not last.
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
