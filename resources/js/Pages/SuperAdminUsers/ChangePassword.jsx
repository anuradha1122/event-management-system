import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ChangePassword({ auth, selectedUser }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        password: '',
        password_confirmation: '',
    });

    const cardStyle = {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '14px',
        padding: '22px',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
    };

    const inputStyle = {
        width: '100%',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '10px 12px',
        fontSize: '14px',
        outline: 'none',
        background: '#ffffff',
    };

    const labelStyle = {
        display: 'block',
        color: '#334155',
        fontSize: '13px',
        fontWeight: '800',
        marginBottom: '6px',
    };

    const buttonStyle = (background = '#111827') => ({
        display: 'inline-block',
        padding: '10px 14px',
        background,
        color: '#ffffff',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '700',
        border: 'none',
        cursor: 'pointer',
    });

    const errorStyle = {
        marginTop: '6px',
        color: '#dc2626',
        fontSize: '13px',
        fontWeight: '700',
    };

    const submit = (e) => {
        e.preventDefault();

        put(route('super-admin.users.password.update', selectedUser.id), {
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Change User Password" />

            <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px' }}>
                <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '16px',
                            flexWrap: 'wrap',
                            marginBottom: '22px',
                        }}
                    >
                        <div>
                            <h1
                                style={{
                                    fontSize: '32px',
                                    lineHeight: '38px',
                                    fontWeight: '900',
                                    color: '#0f172a',
                                    margin: 0,
                                }}
                            >
                                Change Password
                            </h1>

                            <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>
                                Change password for {selectedUser?.name} ({selectedUser?.email}).
                            </p>
                        </div>

                        <Link href={route('super-admin.users.index')} style={buttonStyle('#0f172a')}>
                            Back to Users
                        </Link>
                    </div>

                    <section style={cardStyle}>
                        <form onSubmit={submit}>
                            <div style={{ display: 'grid', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>New Password</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Minimum 8 characters"
                                        style={inputStyle}
                                    />
                                    {errors.password && <div style={errorStyle}>{errors.password}</div>}
                                </div>

                                <div>
                                    <label style={labelStyle}>Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Confirm new password"
                                        style={inputStyle}
                                    />
                                    {errors.password_confirmation && (
                                        <div style={errorStyle}>{errors.password_confirmation}</div>
                                    )}
                                </div>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '10px',
                                    flexWrap: 'wrap',
                                    marginTop: '22px',
                                }}
                            >
                                <Link href={route('super-admin.users.index')} style={buttonStyle('#64748b')}>
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{
                                        ...buttonStyle('#7c3aed'),
                                        opacity: processing ? 0.6 : 1,
                                    }}
                                >
                                    {processing ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
