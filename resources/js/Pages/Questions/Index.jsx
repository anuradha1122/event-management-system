import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { can } from '@/Utils/permissions';

export default function Index({ event, questions }) {
    const { auth, flash } = usePage().props;

    const deleteQuestion = (questionId) => {
        if (confirm('Delete this question?')) {
            router.delete(route('events.questions.destroy', [event.id, questionId]));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Questions - ${event.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 rounded bg-green-100 p-4 text-sm text-green-800">
                            {flash.success}
                        </div>
                    )}

                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                RSVP Questions
                            </h1>
                            <p className="text-sm text-gray-500">
                                Event: {event.title}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href={route('events.show', event.id)}
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
                                Back to Event
                            </Link>

                            {can(auth, 'create questions') && (
                                <Link
                                    href={route('events.questions.create', event.id)}
                                    style={{
                                        display: 'inline-flex',
                                        backgroundColor: '#111827',
                                        color: '#ffffff',
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Add Question
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded bg-white shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Question
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Required
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Options
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">
                                {questions.length > 0 ? (
                                    questions.map((question) => (
                                        <tr key={question.id}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {question.question}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {question.type}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {question.is_required ? 'Yes' : 'No'}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {question.options?.length > 0
                                                    ? question.options.join(', ')
                                                    : '-'}
                                            </td>

                                            <td className="px-6 py-4 text-right text-sm">
                                                {can(auth, 'delete questions') && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteQuestion(question.id)
                                                        }
                                                        style={{
                                                            color: '#dc2626',
                                                            fontWeight: '700',
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-10 text-center text-sm text-gray-500"
                                        >
                                            No RSVP questions created yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
