<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventGuestController;
use App\Http\Controllers\PublicInvitationController;
use App\Http\Controllers\EventQuestionController;
use App\Http\Controllers\EventResponseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventResponseExportController;
use App\Http\Controllers\EventGuestImportController;
use App\Http\Controllers\EventInvitationSendController;
use App\Http\Controllers\EventAnalyticsController;
use App\Http\Controllers\EventTaskController;
use App\Http\Controllers\EventExpenseController;
use App\Http\Controllers\EventVendorController;
use App\Http\Controllers\EventScheduleController;
use App\Http\Controllers\EventStaffController;
use App\Http\Controllers\EventReminderController;
use App\Http\Controllers\NotificationCenterController;
use App\Http\Controllers\EventCheckInController;
use App\Http\Controllers\EventGuestFollowUpController;
use App\Http\Controllers\EventGuestInteractionController;
use App\Http\Controllers\EventActivityLogController;
use App\Http\Controllers\EventDashboardController;
use App\Http\Controllers\EventFinalReportController;
use App\Http\Controllers\EventStatusController;
use App\Http\Controllers\EventQaChecklistController;
use App\Http\Controllers\EventProjectSummaryController;
use App\Http\Controllers\OrganizerManualController;
use App\Http\Controllers\OrganizerManualPdfController;
use App\Http\Controllers\SuperAdminDashboardController;
use App\Http\Controllers\SuperAdminEventController;
use App\Http\Controllers\SuperAdminUserController;
use App\Http\Controllers\SuperAdminActivityLogController;
use App\Http\Controllers\SuperAdminSystemReportController;
use App\Http\Controllers\SuperAdminTestingDocumentationController;
use App\Http\Controllers\SuperAdminTestingDocumentationPdfController;
use App\Http\Controllers\SuperAdminProjectHandoverController;
use App\Http\Controllers\SuperAdminProjectHandoverPdfController;
use App\Http\Controllers\SuperAdminFinalSubmissionController;
use App\Http\Controllers\SuperAdminFinalSubmissionPdfController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/invitation/{token}', [PublicInvitationController::class, 'show'])
    ->name('public.invitations.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('permission:view dashboard')
        ->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');

    Route::resource('events', EventController::class)
        ->middleware('permission:view own events');

    Route::get('/events/{event}/guests', [EventGuestController::class, 'index'])
        ->middleware('permission:view guests')
        ->name('events.guests.index');

    Route::get('/events/{event}/guests/create', [EventGuestController::class, 'create'])
        ->middleware('permission:create guests')
        ->name('events.guests.create');

    Route::post('/events/{event}/guests', [EventGuestController::class, 'store'])
        ->middleware('permission:create guests')
        ->name('events.guests.store');

    Route::delete('/events/{event}/guests/{guest}', [EventGuestController::class, 'destroy'])
        ->middleware('permission:delete guests')
        ->name('events.guests.destroy');

    Route::get('/invite/{token}', [PublicInvitationController::class, 'show'])
        ->name('invite.show');

    Route::post('/invite/{token}', [PublicInvitationController::class, 'submit'])
        ->name('invite.submit');

    Route::get('/events/{event}/questions', [EventQuestionController::class, 'index'])
        ->middleware('permission:view questions')
        ->name('events.questions.index');

    Route::get('/events/{event}/questions/create', [EventQuestionController::class, 'create'])
        ->middleware('permission:create questions')
        ->name('events.questions.create');

    Route::post('/events/{event}/questions', [EventQuestionController::class, 'store'])
        ->middleware('permission:create questions')
        ->name('events.questions.store');

    Route::delete('/events/{event}/questions/{question}', [EventQuestionController::class, 'destroy'])
        ->middleware('permission:delete questions')
        ->name('events.questions.destroy');

    Route::get('/events/{event}/responses', [EventResponseController::class, 'index'])
        ->middleware('permission:view responses')
        ->name('events.responses.index');

    Route::get('/events/{event}/responses', [EventResponseController::class, 'index'])
        ->middleware('permission:view responses')
        ->name('events.responses.index');

    Route::get('/events/{event}/responses/export', [EventResponseExportController::class, 'csv'])
        ->middleware('permission:export responses')
        ->name('events.responses.export');


    Route::get('/events/{event}/guests/import', [EventGuestImportController::class, 'create'])
        ->name('events.guests.import.create');

    Route::post('/events/{event}/guests/import', [EventGuestImportController::class, 'store'])
        ->name('events.guests.import.store');
    });

    Route::post('/events/{event}/guests/{guest}/send-invitation', [EventInvitationSendController::class, 'send'])
        ->name('events.guests.send-invitation');

    Route::post('/events/{event}/send-all-invitations', [EventInvitationSendController::class, 'sendAll'])
        ->name('events.guests.send-all-invitations');

    Route::get('/events/{event}/analytics', [EventAnalyticsController::class, 'show'])
        ->name('events.analytics');

    Route::get('/events/{event}/tasks', [EventTaskController::class, 'index'])
        ->name('events.tasks.index');

    Route::get('/events/{event}/tasks/create', [EventTaskController::class, 'create'])
        ->name('events.tasks.create');

    Route::post('/events/{event}/tasks', [EventTaskController::class, 'store'])
        ->name('events.tasks.store');

    Route::get('/events/{event}/tasks/{task}/edit', [EventTaskController::class, 'edit'])
        ->name('events.tasks.edit');

    Route::put('/events/{event}/tasks/{task}', [EventTaskController::class, 'update'])
        ->name('events.tasks.update');

    Route::patch('/events/{event}/tasks/{task}/done', [EventTaskController::class, 'markDone'])
        ->name('events.tasks.done');

    Route::delete('/events/{event}/tasks/{task}', [EventTaskController::class, 'destroy'])
        ->name('events.tasks.destroy');

    Route::get('/events/{event}/expenses', [EventExpenseController::class, 'index'])
        ->name('events.expenses.index');

    Route::get('/events/{event}/expenses/create', [EventExpenseController::class, 'create'])
        ->name('events.expenses.create');

    Route::post('/events/{event}/expenses', [EventExpenseController::class, 'store'])
        ->name('events.expenses.store');

    Route::get('/events/{event}/expenses/{expense}/edit', [EventExpenseController::class, 'edit'])
        ->name('events.expenses.edit');

    Route::put('/events/{event}/expenses/{expense}', [EventExpenseController::class, 'update'])
        ->name('events.expenses.update');

    Route::delete('/events/{event}/expenses/{expense}', [EventExpenseController::class, 'destroy'])
        ->name('events.expenses.destroy');

    Route::get('/events/{event}/vendors', [EventVendorController::class, 'index'])
        ->name('events.vendors.index');

    Route::get('/events/{event}/vendors/create', [EventVendorController::class, 'create'])
        ->name('events.vendors.create');

    Route::post('/events/{event}/vendors', [EventVendorController::class, 'store'])
        ->name('events.vendors.store');

    Route::get('/events/{event}/vendors/{vendor}/edit', [EventVendorController::class, 'edit'])
        ->name('events.vendors.edit');

    Route::put('/events/{event}/vendors/{vendor}', [EventVendorController::class, 'update'])
        ->name('events.vendors.update');

    Route::delete('/events/{event}/vendors/{vendor}', [EventVendorController::class, 'destroy'])
        ->name('events.vendors.destroy');

    Route::get('/events/{event}/schedules', [EventScheduleController::class, 'index'])
        ->name('events.schedules.index');

    Route::get('/events/{event}/schedules/create', [EventScheduleController::class, 'create'])
        ->name('events.schedules.create');

    Route::post('/events/{event}/schedules', [EventScheduleController::class, 'store'])
        ->name('events.schedules.store');

    Route::get('/events/{event}/schedules/{schedule}/edit', [EventScheduleController::class, 'edit'])
        ->name('events.schedules.edit');

    Route::put('/events/{event}/schedules/{schedule}', [EventScheduleController::class, 'update'])
        ->name('events.schedules.update');

    Route::patch('/events/{event}/schedules/{schedule}/complete', [EventScheduleController::class, 'complete'])
        ->name('events.schedules.complete');

    Route::delete('/events/{event}/schedules/{schedule}', [EventScheduleController::class, 'destroy'])
        ->name('events.schedules.destroy');

    Route::get('/events/{event}/staff', [EventStaffController::class, 'index'])
        ->name('events.staff.index');

    Route::get('/events/{event}/staff/create', [EventStaffController::class, 'create'])
        ->name('events.staff.create');

    Route::post('/events/{event}/staff', [EventStaffController::class, 'store'])
        ->name('events.staff.store');

    Route::get('/events/{event}/staff/{staff}/edit', [EventStaffController::class, 'edit'])
        ->name('events.staff.edit');

    Route::put('/events/{event}/staff/{staff}', [EventStaffController::class, 'update'])
        ->name('events.staff.update');

    Route::delete('/events/{event}/staff/{staff}', [EventStaffController::class, 'destroy'])
        ->name('events.staff.destroy');

    Route::get('/events/{event}/reminders', [EventReminderController::class, 'index'])
        ->name('events.reminders.index');

    Route::get('/events/{event}/reminders/create', [EventReminderController::class, 'create'])
        ->name('events.reminders.create');

    Route::post('/events/{event}/reminders', [EventReminderController::class, 'store'])
        ->name('events.reminders.store');

    Route::get('/events/{event}/reminders/{reminder}/edit', [EventReminderController::class, 'edit'])
        ->name('events.reminders.edit');

    Route::put('/events/{event}/reminders/{reminder}', [EventReminderController::class, 'update'])
        ->name('events.reminders.update');

    Route::patch('/events/{event}/reminders/{reminder}/sent', [EventReminderController::class, 'markSent'])
        ->name('events.reminders.sent');

    Route::patch('/events/{event}/reminders/{reminder}/cancel', [EventReminderController::class, 'cancel'])
        ->name('events.reminders.cancel');

    Route::delete('/events/{event}/reminders/{reminder}', [EventReminderController::class, 'destroy'])
        ->name('events.reminders.destroy');

    Route::get('/events/{event}/reminders/{reminder}/logs', [EventReminderController::class, 'logs'])
        ->name('events.reminders.logs');

    Route::post('/events/{event}/reminders/{reminder}/logs/retry-failed', [EventReminderController::class, 'retryFailedLogs'])
        ->name('events.reminders.logs.retry-failed');

    Route::get('/events/{event}/reminders/{reminder}/logs/export', [EventReminderController::class, 'exportLogs'])
        ->name('events.reminders.logs.export');

    Route::get('/events/{event}/reminder-logs', [EventReminderController::class, 'eventLogs'])
        ->name('events.reminder-logs.index');

    Route::get('/events/{event}/reminder-logs/export', [EventReminderController::class, 'exportEventLogs'])
        ->name('events.reminder-logs.export');

    Route::get('/notifications', [NotificationCenterController::class, 'index'])
        ->name('notifications.index');

    Route::patch('/events/{event}/reminder-logs/{log}/review', [EventReminderController::class, 'markLogReviewed'])
        ->name('events.reminder-logs.review');

    Route::get('/events/{event}/check-in', [EventCheckInController::class, 'index'])
        ->name('events.check-in.index');

    Route::patch('/events/{event}/guests/{guest}/check-in', [EventCheckInController::class, 'checkIn'])
        ->name('events.guests.check-in');

    Route::patch('/events/{event}/guests/{guest}/undo-check-in', [EventCheckInController::class, 'undoCheckIn'])
        ->name('events.guests.undo-check-in');

    Route::get('/events/{event}/check-in', [EventCheckInController::class, 'index'])
        ->name('events.check-in.index');

    Route::patch('/events/{event}/guests/{guest}/check-in', [EventCheckInController::class, 'checkIn'])
        ->name('events.guests.check-in');

    Route::patch('/events/{event}/guests/{guest}/undo-check-in', [EventCheckInController::class, 'undoCheckIn'])
        ->name('events.guests.undo-check-in');

    Route::get('/events/{event}/check-in/export', [EventCheckInController::class, 'export'])
        ->name('events.check-in.export');

    Route::get('/events/{event}/guest-follow-ups', [EventGuestFollowUpController::class, 'index'])
        ->name('events.guest-follow-ups.index');

    Route::get('/events/{event}/guest-follow-ups/export', [EventGuestFollowUpController::class, 'export'])
        ->name('events.guest-follow-ups.export');

    Route::post('/events/{event}/guests/{guest}/follow-up/send', [EventGuestFollowUpController::class, 'send'])
        ->name('events.guests.follow-up.send');

    Route::patch('/events/{event}/guests/{guest}/follow-up/mark', [EventGuestFollowUpController::class, 'mark'])
        ->name('events.guests.follow-up.mark');

    Route::post('/events/{event}/guest-follow-ups/bulk-send', [EventGuestFollowUpController::class, 'bulkSend'])
        ->name('events.guest-follow-ups.bulk-send');

    Route::patch('/events/{event}/guest-follow-ups/bulk-mark', [EventGuestFollowUpController::class, 'bulkMark'])
        ->name('events.guest-follow-ups.bulk-mark');

    Route::get('/events/{event}/guests/{guest}/interactions', [EventGuestInteractionController::class, 'index'])
        ->name('events.guests.interactions.index');

    Route::post('/events/{event}/guests/{guest}/interactions', [EventGuestInteractionController::class, 'store'])
        ->name('events.guests.interactions.store');

    Route::delete('/events/{event}/guests/{guest}/interactions/{interaction}', [EventGuestInteractionController::class, 'destroy'])
        ->name('events.guests.interactions.destroy');

    Route::get('/events/{event}/activity-logs', [EventActivityLogController::class, 'index'])
        ->name('events.activity-logs.index');

    Route::get('/events/{event}/dashboard', [EventDashboardController::class, 'show'])
        ->name('events.dashboard');

    Route::get('/events/{event}/final-report/pdf', [EventFinalReportController::class, 'pdf'])
        ->name('events.final-report.pdf');

    Route::patch('/events/{event}/activate', [EventStatusController::class, 'activate'])
        ->name('events.activate');

    Route::patch('/events/{event}/complete', [EventStatusController::class, 'complete'])
        ->name('events.complete');

    Route::patch('/events/{event}/cancel', [EventStatusController::class, 'cancel'])
        ->name('events.cancel');

    Route::patch('/events/{event}/reopen', [EventStatusController::class, 'reopen'])
        ->name('events.reopen');

    Route::get('/events/{event}/qa-checklist', [EventQaChecklistController::class, 'index'])
        ->name('events.qa-checklist.index');

    Route::patch('/events/{event}/qa-checklist/{check}', [EventQaChecklistController::class, 'update'])
        ->name('events.qa-checklist.update');

    Route::patch('/events/{event}/qa-checklist/reset', [EventQaChecklistController::class, 'reset'])
        ->name('events.qa-checklist.reset');

    Route::get('/events/{event}/project-summary', [EventProjectSummaryController::class, 'show'])
        ->name('events.project-summary');

    Route::get('/events/{event}/project-summary', [EventProjectSummaryController::class, 'show'])
        ->name('events.project-summary');

    Route::get('/events/{event}/organizer-manual', [OrganizerManualController::class, 'show'])
        ->name('events.organizer-manual');

    Route::get('/events/{event}/organizer-manual/pdf', [OrganizerManualPdfController::class, 'pdf'])
        ->name('events.organizer-manual.pdf');

    Route::get('/super-admin/dashboard', [SuperAdminDashboardController::class, 'index'])
        ->middleware(['role:Super Admin'])
        ->name('super-admin.dashboard');

    Route::get('/super-admin/events', [SuperAdminEventController::class, 'index'])
        ->middleware('role:Super Admin')
        ->name('super-admin.events.index');

    Route::get('/super-admin/users', [SuperAdminUserController::class, 'index'])
        ->middleware(['auth', 'verified', 'role:Super Admin'])
        ->name('super-admin.users.index');

    Route::get('/super-admin/users/create', [SuperAdminUserController::class, 'create'])
        ->middleware(['auth', 'verified', 'role:Super Admin'])
        ->name('super-admin.users.create');

    Route::post('/super-admin/users', [SuperAdminUserController::class, 'store'])
        ->middleware(['auth', 'verified', 'role:Super Admin'])
        ->name('super-admin.users.store');

    Route::get('/super-admin/users/{user}/edit', [SuperAdminUserController::class, 'edit'])
        ->middleware(['auth', 'verified', 'role:Super Admin'])
        ->name('super-admin.users.edit');

    Route::put('/super-admin/users/{user}', [SuperAdminUserController::class, 'update'])
        ->middleware(['auth', 'verified', 'role:Super Admin'])
        ->name('super-admin.users.update');

    Route::get('/super-admin/users/{user}/password', [SuperAdminUserController::class, 'editPassword'])
        ->middleware(['auth', 'verified', 'role:Super Admin'])
        ->name('super-admin.users.password.edit');

    Route::put('/super-admin/users/{user}/password', [SuperAdminUserController::class, 'updatePassword'])
        ->middleware(['auth', 'verified', 'role:Super Admin'])
        ->name('super-admin.users.password.update');

    Route::delete('/super-admin/users/{user}', [SuperAdminUserController::class, 'destroy'])
        ->middleware(['auth', 'verified', 'role:Super Admin'])
        ->name('super-admin.users.destroy');

    Route::get('/super-admin/activity-logs', [SuperAdminActivityLogController::class, 'index'])
        ->middleware('role:Super Admin')
        ->name('super-admin.activity-logs.index');

    Route::get('/super-admin/system-report/pdf', [SuperAdminSystemReportController::class, 'pdf'])
        ->middleware('role:Super Admin')
        ->name('super-admin.system-report.pdf');

    Route::get('/super-admin/testing-documentation', [SuperAdminTestingDocumentationController::class, 'index'])
        ->middleware('role:Super Admin')
        ->name('super-admin.testing-documentation.index');

    Route::get('/super-admin/testing-documentation/pdf', [SuperAdminTestingDocumentationPdfController::class, 'pdf'])
        ->middleware('role:Super Admin')
        ->name('super-admin.testing-documentation.pdf');

    Route::get('/super-admin/project-handover', [SuperAdminProjectHandoverController::class, 'index'])
        ->middleware('role:Super Admin')
        ->name('super-admin.project-handover.index');

    Route::get('/super-admin/project-handover/pdf', [SuperAdminProjectHandoverPdfController::class, 'pdf'])
        ->middleware('role:Super Admin')
        ->name('super-admin.project-handover.pdf');

    Route::get('/super-admin/final-submission', [SuperAdminFinalSubmissionController::class, 'index'])
        ->middleware('role:Super Admin')
        ->name('super-admin.final-submission.index');

    Route::get('/super-admin/final-submission/pdf', [SuperAdminFinalSubmissionPdfController::class, 'pdf'])
        ->middleware('role:Super Admin')
        ->name('super-admin.final-submission.pdf');

require __DIR__.'/auth.php';
