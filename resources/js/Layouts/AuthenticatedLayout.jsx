import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { can, hasRole } from '@/Utils/permissions';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, notificationSummary } = usePage().props;

    const user = auth.user;
    const urgentCount = notificationSummary?.urgent_count ?? 0;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const dropdownButtonClass =
        'inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 focus:outline-none';

    const pdfDropdownLinkClass =
        'block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none';

    const pdfMobileLinkClass =
        'block w-full border-l-4 border-transparent py-2 pe-4 ps-3 text-start text-base font-medium text-gray-600 transition duration-150 ease-in-out hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:border-gray-300 focus:bg-gray-50 focus:text-gray-800 focus:outline-none';

    const notificationBadge = urgentCount > 0 && (
        <span
            style={{
                marginLeft: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '20px',
                height: '20px',
                padding: '0 6px',
                borderRadius: '999px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: '900',
                lineHeight: '1',
            }}
        >
            {urgentCount}
        </span>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>

                                {can(auth, 'view own events') && (
                                    <NavLink
                                        href={route('events.index')}
                                        active={route().current('events.*')}
                                    >
                                        Events
                                    </NavLink>
                                )}

                                {hasRole(auth, 'Super Admin') && (
                                    <div className="flex items-center">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <button type="button" className={dropdownButtonClass}>
                                                    Super Admin

                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link href={route('super-admin.dashboard')}>
                                                    Dashboard
                                                </Dropdown.Link>

                                                <Dropdown.Link href={route('super-admin.events.index')}>
                                                    All Events
                                                </Dropdown.Link>

                                                <Dropdown.Link href={route('super-admin.users.index')}>
                                                    Users
                                                </Dropdown.Link>

                                                <Dropdown.Link href={route('super-admin.activity-logs.index')}>
                                                    Activity Logs
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                )}

                                {hasRole(auth, 'Super Admin') && (
                                    <div className="flex items-center">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <button type="button" className={dropdownButtonClass}>
                                                    Final Submission

                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link href={route('super-admin.final-submission.index')}>
                                                    Master Final Dashboard
                                                </Dropdown.Link>

                                                <a
                                                    href={route('super-admin.final-submission.pdf')}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={pdfDropdownLinkClass}
                                                >
                                                    Master Final PDF
                                                </a>

                                                <Dropdown.Link href={route('super-admin.testing-documentation.index')}>
                                                    Testing Documentation
                                                </Dropdown.Link>

                                                <a
                                                    href={route('super-admin.testing-documentation.pdf')}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={pdfDropdownLinkClass}
                                                >
                                                    Testing Documentation PDF
                                                </a>

                                                <Dropdown.Link href={route('super-admin.project-handover.index')}>
                                                    Project Handover
                                                </Dropdown.Link>

                                                <a
                                                    href={route('super-admin.project-handover.pdf')}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={pdfDropdownLinkClass}
                                                >
                                                    Project Handover PDF
                                                </a>

                                                <a
                                                    href={route('super-admin.system-report.pdf')}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={pdfDropdownLinkClass}
                                                >
                                                    System Report PDF
                                                </a>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                )}

                                <NavLink
                                    href={route('notifications.index')}
                                    active={route().current('notifications.*')}
                                >
                                    <span className="inline-flex items-center">
                                        Notifications
                                        {notificationBadge}
                                    </span>
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>

                                        {hasRole(auth, 'Super Admin') && (
                                            <>
                                                <Dropdown.Link href={route('super-admin.dashboard')}>
                                                    Super Admin Dashboard
                                                </Dropdown.Link>

                                                <Dropdown.Link href={route('super-admin.final-submission.index')}>
                                                    Final Submission Dashboard
                                                </Dropdown.Link>
                                            </>
                                        )}

                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />

                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>

                        {can(auth, 'view own events') && (
                            <ResponsiveNavLink
                                href={route('events.index')}
                                active={route().current('events.*')}
                            >
                                Events
                            </ResponsiveNavLink>
                        )}

                        {hasRole(auth, 'Super Admin') && (
                            <>
                                <div className="px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                                    Super Admin
                                </div>

                                <ResponsiveNavLink
                                    href={route('super-admin.dashboard')}
                                    active={route().current('super-admin.dashboard')}
                                >
                                    Dashboard
                                </ResponsiveNavLink>

                                <ResponsiveNavLink
                                    href={route('super-admin.events.index')}
                                    active={route().current('super-admin.events.*')}
                                >
                                    All Events
                                </ResponsiveNavLink>

                                <ResponsiveNavLink
                                    href={route('super-admin.users.index')}
                                    active={route().current('super-admin.users.*')}
                                >
                                    Users
                                </ResponsiveNavLink>

                                <ResponsiveNavLink
                                    href={route('super-admin.activity-logs.index')}
                                    active={route().current('super-admin.activity-logs.*')}
                                >
                                    Activity Logs
                                </ResponsiveNavLink>

                                <div className="px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                                    Final Submission
                                </div>

                                <ResponsiveNavLink
                                    href={route('super-admin.final-submission.index')}
                                    active={route().current('super-admin.final-submission.*')}
                                >
                                    Master Final Dashboard
                                </ResponsiveNavLink>

                                <a
                                    href={route('super-admin.final-submission.pdf')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={pdfMobileLinkClass}
                                >
                                    Master Final PDF
                                </a>

                                <ResponsiveNavLink
                                    href={route('super-admin.testing-documentation.index')}
                                    active={route().current('super-admin.testing-documentation.*')}
                                >
                                    Testing Documentation
                                </ResponsiveNavLink>

                                <a
                                    href={route('super-admin.testing-documentation.pdf')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={pdfMobileLinkClass}
                                >
                                    Testing Documentation PDF
                                </a>

                                <ResponsiveNavLink
                                    href={route('super-admin.project-handover.index')}
                                    active={route().current('super-admin.project-handover.*')}
                                >
                                    Project Handover
                                </ResponsiveNavLink>

                                <a
                                    href={route('super-admin.project-handover.pdf')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={pdfMobileLinkClass}
                                >
                                    Project Handover PDF
                                </a>

                                <a
                                    href={route('super-admin.system-report.pdf')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={pdfMobileLinkClass}
                                >
                                    System Report PDF
                                </a>
                            </>
                        )}

                        <ResponsiveNavLink
                            href={route('notifications.index')}
                            active={route().current('notifications.*')}
                        >
                            Notifications {urgentCount > 0 ? `(${urgentCount})` : ''}
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>

                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>

                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
