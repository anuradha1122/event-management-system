import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ event, questions = [], guests = [], summary }) {
    const getAnswer = (guest, questionId) => {
        const answers = guest.invitation?.answers || [];
        const answer = answers.find(
            (item) => Number(item.question_id) === Number(questionId)
        );

        return answer?.answer || '-';
    };

    const formatDateTime = (value) => {
        if (!value) return '-';

        return new Date(value).toLocaleString();
    };

    const statusStyle = (status) => {
        if (status === 'accepted') {
            return {
                backgroundColor: '#dcfce7',
                color: '#166534',
            };
        }

        if (status === 'declined') {
            return {
                backgroundColor: '#fee2e2',
                color: '#991b1b',
            };
        }

        return {
            backgroundColor: '#fef3c7',
            color: '#92400e',
        };
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Responses - ${event.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                RSVP Responses
                            </h1>
                            <p className="text-sm text-gray-500">
                                Event: {event.title}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <a
                                href={route('events.responses.export', event.id)}
                                style={{
                                    display: 'inline-flex',
                                    backgroundColor: '#059669',
                                    color: '#ffffff',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                }}
                            >
                                Export CSV
                            </a>

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
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: '16px',
                            marginBottom: '24px',
                        }}
                    >
                        <SummaryCard
                            label="Total Guests"
                            value={summary.total_guests}
                        />
                        <SummaryCard
                            label="Accepted"
                            value={summary.accepted}
                            color="#166534"
                            background="#dcfce7"
                        />
                        <SummaryCard
                            label="Declined"
                            value={summary.declined}
                            color="#991b1b"
                            background="#fee2e2"
                        />
                        <SummaryCard
                            label="Pending"
                            value={summary.pending}
                            color="#92400e"
                            background="#fef3c7"
                        />
                        <SummaryCard
                            label="Extra Guests"
                            value={summary.total_extra_guests}
                            color="#1d4ed8"
                            background="#dbeafe"
                        />
                    </div>

                    <div className="overflow-x-auto rounded bg-white shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Guest
                                    </th>

                                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Contact
                                    </th>

                                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Status
                                    </th>

                                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Extra Count
                                    </th>

                                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Responded At
                                    </th>

                                    {questions.map((question) => (
                                        <th
                                            key={question.id}
                                            className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500"
                                        >
                                            {question.question}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">
                                {guests.length > 0 ? (
                                    guests.map((guest) => (
                                        <tr key={guest.id}>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                {guest.name}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                <div>{guest.email || '-'}</div>
                                                <div>{guest.phone || '-'}</div>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <span
                                                    style={{
                                                        display: 'inline-flex',
                                                        padding: '4px 10px',
                                                        borderRadius: '999px',
                                                        fontWeight: '700',
                                                        ...statusStyle(guest.status),
                                                    }}
                                                >
                                                    {guest.status}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                {guest.guest_count}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                {formatDateTime(
                                                    guest.invitation?.responded_at
                                                )}
                                            </td>

                                            {questions.map((question) => (
                                                <td
                                                    key={question.id}
                                                    className="min-w-[180px] px-6 py-4 text-sm text-gray-700"
                                                >
                                                    {getAnswer(guest, question.id)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5 + questions.length}
                                            className="px-6 py-10 text-center text-sm text-gray-500"
                                        >
                                            No guests or responses found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {questions.length === 0 && (
                        <div
                            style={{
                                marginTop: '16px',
                                borderRadius: '10px',
                                backgroundColor: '#eff6ff',
                                color: '#1d4ed8',
                                padding: '14px 16px',
                                fontWeight: '700',
                            }}
                        >
                            No custom questions added yet. RSVP status and guest
                            counts are still shown.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function SummaryCard({
    label,
    value,
    color = '#111827',
    background = '#f9fafb',
}) {
    return (
        <div
            style={{
                backgroundColor: background,
                borderRadius: '14px',
                padding: '18px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
        >
            <p
                style={{
                    color: '#6b7280',
                    fontSize: '13px',
                    fontWeight: '700',
                    marginBottom: '8px',
                }}
            >
                {label}
            </p>

            <p
                style={{
                    color,
                    fontSize: '30px',
                    fontWeight: '900',
                }}
            >
                {value}
            </p>
        </div>
    );
}
