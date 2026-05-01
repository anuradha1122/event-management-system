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

require __DIR__.'/auth.php';
