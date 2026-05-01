import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ event }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        guest_count: 0,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('events.guests.store', event.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Add Guest - ${event.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Add Guest
                            </h1>
                            <p className="text-sm text-gray-500">
                                Event: {event.title}
                            </p>
                        </div>

                        <Link
                            href={route('events.guests.index', event.id)}
                            style={{
                                color: '#374151',
                                fontWeight: '700',
                                textDecoration: 'none',
                            }}
                        >
                            Back
                        </Link>
                    </div>

                    <form
                        onSubmit={submit}
                        className="space-y-5 rounded bg-white p-6 shadow"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Guest Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 w-full rounded border-gray-300 shadow-sm"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 w-full rounded border-gray-300 shadow-sm"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Phone
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="mt-1 w-full rounded border-gray-300 shadow-sm"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Guest Count
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={data.guest_count}
                                onChange={(e) =>
                                    setData('guest_count', e.target.value)
                                }
                                className="mt-1 w-full rounded border-gray-300 shadow-sm"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Use this for extra people coming with this guest.
                            </p>
                            {errors.guest_count && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.guest_count}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: processing
                                        ? '#6b7280'
                                        : '#111827',
                                    color: '#ffffff',
                                    padding: '10px 18px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    border: '1px solid #111827',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                }}
                            >
                                Save Guest
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
