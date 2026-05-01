import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Import({ auth, event }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        csv_file: null,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('events.guests.import.store', event.id), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Import Guests" />

            <div className="mx-auto max-w-4xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Import Guests
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Event: {event.title}
                        </p>
                    </div>

                    <Link
                        href={route('events.guests.index', event.id)}
                        style={{
                            backgroundColor: '#374151',
                            color: '#ffffff',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: '600',
                        }}
                    >
                        Back to Guests
                    </Link>
                </div>

                <div className="rounded-lg bg-white p-6 shadow">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                CSV File
                            </label>

                            <input
                                type="file"
                                accept=".csv,text/csv"
                                onChange={(e) =>
                                    setData('csv_file', e.target.files?.[0] || null)
                                }
                                className="block w-full rounded border border-gray-300 p-2 text-sm"
                            />

                            {errors.csv_file && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.csv_file}
                                </p>
                            )}

                            {progress && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Uploading: {progress.percentage}%
                                </p>
                            )}
                        </div>

                        <div className="rounded border border-gray-200 bg-gray-50 p-4">
                            <h2 className="mb-2 font-semibold text-gray-800">
                                Required CSV Format
                            </h2>

                            <p className="mb-3 text-sm text-gray-600">
                                Your CSV file must contain these columns:
                            </p>

                            <pre className="overflow-x-auto rounded bg-gray-900 p-4 text-sm text-green-300">
                                {`name,email,phone,guest_count
                                John Silva,john@example.com,0771234567,2
                                Nimal Perera,nimal@example.com,0719876543,1`}
                            </pre>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    backgroundColor: processing ? '#9CA3AF' : '#111827',
                                    color: '#ffffff',
                                    padding: '10px 18px',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {processing ? 'Importing...' : 'Import Guests'}
                            </button>

                            <Link
                                href={route('events.guests.index', event.id)}
                                style={{
                                    backgroundColor: '#E5E7EB',
                                    color: '#111827',
                                    padding: '10px 18px',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                }}
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
