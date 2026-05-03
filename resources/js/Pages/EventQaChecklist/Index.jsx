import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ event, checks, summary, statusOptions }) {
    const { flash } = usePage().props;
    const [notes, setNotes] = useState(
        Object.fromEntries(checks.map((check) => [check.id, check.note || '']))
    );

    const buttonStyle = (backgroundColor = '#2563eb') => ({
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        color: '#ffffff',
        padding: '9px 14px',
        borderRadius: '8px',
        fontWeight: '700',
        textDecoration: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '13px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
    });

    const grayButtonStyle = {
        display: 'inline-flex',
        backgroundColor: '#e5e7eb',
        color: '#111827',
        padding: '9px 14px',
        borderRadius: '8px',
        fontWeight: '700',
        textDecoration: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '13px',
    };

    const statusBadgeStyle = (status) => {
        const styles = {
            pending: {
                backgroundColor: '#fef3c7',
                color: '#92400e',
                border: '1px solid #f59e0b',
            },
            passed: {
                backgroundColor: '#dcfce7',
                color: '#166534',
                border: '1px solid #22c55e',
            },
            failed: {
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                border: '1px solid #ef4444',
            },
        };

        return {
            display: 'inline-flex',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '800',
            textTransform: 'capitalize',
            ...(styles[status] || styles.pending),
        };
    };

    const updateCheck = (check, status) => {
        router.patch(
            route('events.qa-checklist.update', {
                event: event.id,
                check: check.id,
            }),
            {
                status,
                note: notes[check.id] || '',
            },
            {
                preserveScroll: true,
            }
        );
    };

    const resetChecklist = () => {
        if (!confirm('Reset all QA checklist items to pending?')) {
            return;
        }

        router.patch(
            route('events.qa-checklist.reset', event.id),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const groupedChecks = checks.reduce((groups, check) => {
        const category = check.category || 'Other';

        if (!groups[category]) {
            groups[category] = [];
        }

        groups[category].push(check);

        return groups;
    }, {});

    return (
        <AuthenticatedLayout>
            <Head title={`QA Checklist - ${event.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 rounded bg-green-100 p-4 text-sm text-green-800">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-4 rounded bg-red-100 p-4 text-sm text-red-800">
                            {flash.error}
                        </div>
                    )}

                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Event QA Checklist
                            </h1>
                            <p className="text-sm text-gray-500">
                                {event.title} | Status: {event.status || 'draft'}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Link
                                href={route('events.show', event.id)}
                                style={grayButtonStyle}
                            >
                                Back to Event
                            </Link>

                            <button
                                type="button"
                                onClick={resetChecklist}
                                style={buttonStyle('#dc2626')}
                            >
                                Reset Checklist
                            </button>
                        </div>
                    </div>

                    <div className="mb-6 grid gap-4 md:grid-cols-5">
                        <div className="rounded bg-white p-4 shadow">
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {summary.total}
                            </p>
                        </div>

                        <div className="rounded bg-white p-4 shadow">
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-2xl font-bold text-yellow-700">
                                {summary.pending}
                            </p>
                        </div>

                        <div className="rounded bg-white p-4 shadow">
                            <p className="text-sm text-gray-500">Passed</p>
                            <p className="text-2xl font-bold text-green-700">
                                {summary.passed}
                            </p>
                        </div>

                        <div className="rounded bg-white p-4 shadow">
                            <p className="text-sm text-gray-500">Failed</p>
                            <p className="text-2xl font-bold text-red-700">
                                {summary.failed}
                            </p>
                        </div>

                        <div className="rounded bg-white p-4 shadow">
                            <p className="text-sm text-gray-500">Completion</p>
                            <p className="text-2xl font-bold text-blue-700">
                                {summary.completion_percentage}%
                            </p>
                        </div>
                    </div>

                    <div className="mb-6 rounded bg-white p-5 shadow">
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm font-bold text-gray-700">
                                Testing Progress
                            </p>
                            <p className="text-sm text-gray-500">
                                Pass Rate: {summary.pass_percentage}%
                            </p>
                        </div>

                        <div className="h-4 overflow-hidden rounded-full bg-gray-200">
                            <div
                                className="h-full bg-green-600"
                                style={{
                                    width: `${summary.pass_percentage}%`,
                                }}
                            />
                        </div>
                    </div>

                    {Object.entries(groupedChecks).map(([category, items]) => (
                        <div
                            key={category}
                            className="mb-6 overflow-hidden rounded bg-white shadow"
                        >
                            <div className="border-b bg-gray-900 px-5 py-3">
                                <h2 className="font-bold text-white">
                                    {category}
                                </h2>
                            </div>

                            <div className="divide-y">
                                {items.map((check) => (
                                    <div
                                        key={check.id}
                                        className="grid gap-4 p-5 lg:grid-cols-[1.4fr_1fr_auto]"
                                    >
                                        <div>
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                <h3 className="font-bold text-gray-900">
                                                    {check.title}
                                                </h3>

                                                <span
                                                    style={statusBadgeStyle(
                                                        check.status
                                                    )}
                                                >
                                                    {check.status}
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-600">
                                                {check.description}
                                            </p>

                                            {check.tester && (
                                                <p className="mt-2 text-xs text-gray-500">
                                                    Tested by {check.tester.name}
                                                    {check.tested_at
                                                        ? ` at ${check.tested_at}`
                                                        : ''}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-bold text-gray-600">
                                                Tester Note
                                            </label>

                                            <textarea
                                                value={notes[check.id] || ''}
                                                onChange={(e) =>
                                                    setNotes((previous) => ({
                                                        ...previous,
                                                        [check.id]: e.target.value,
                                                    }))
                                                }
                                                rows="3"
                                                className="w-full rounded border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Add testing note..."
                                            />
                                        </div>

                                        <div className="flex flex-wrap items-start gap-2 lg:flex-col">
                                            {statusOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() =>
                                                        updateCheck(
                                                            check,
                                                            option.value
                                                        )
                                                    }
                                                    style={buttonStyle(
                                                        option.value === 'passed'
                                                            ? '#16a34a'
                                                            : option.value ===
                                                                'failed'
                                                              ? '#dc2626'
                                                              : '#d97706'
                                                    )}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
