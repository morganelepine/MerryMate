<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\GiftListController;
use App\Http\Controllers\IdeaController;
use App\Http\Controllers\MultipleIdeaController;
use App\Http\Controllers\NotificationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('lists.index');
    }
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Profile management
Route::middleware('auth')->prefix('profile')->group(function () {
    // Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/budget', [ProfileController::class, 'purchase'])->name('profile.purchase');
    Route::get('/gifts', [ProfileController::class, 'gifts'])->name('profile.gifts');
    Route::get('/notifications', [ProfileController::class, 'notifications'])->name('profile.notifications');
});

// Ideas management
Route::middleware('auth')->prefix('ideas')->group(function () {
    Route::get('/create/{list}', [IdeaController::class, 'create'])->name('ideas.create');
});

// No 'auth' middleware, only a throttle against abuse.
Route::middleware('throttle:60,1')->prefix('ideas')->group(function () {
    Route::patch('/{idea}/reserve',  [IdeaController::class, 'reserveIdea'])->name('ideas.reserve');
    Route::patch('/{idea}/purchase', [IdeaController::class, 'purchaseIdea'])->name('ideas.purchase');
    Route::patch('/{idea}/cancel',   [IdeaController::class, 'cancelReservationOrPurchase'])->name('ideas.cancel');
});

Route::resource('ideas', IdeaController::class)
    ->only(['store', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);

// Multiple ideas management
Route::middleware('throttle:60,1')->prefix('multiple-ideas')->group(function () {
    Route::patch('/{multipleIdea}/reserve',  [MultipleIdeaController::class, 'reserveMultipleIdea'])->name('multiple-ideas.reserve');
    Route::patch('/{multipleIdea}/purchase', [MultipleIdeaController::class, 'purchaseMultipleIdea'])->name('multiple-ideas.purchase');
    Route::patch('/{multipleIdea}/cancel',   [MultipleIdeaController::class, 'cancelMultipleIdea'])->name('multiple-ideas.cancel');
});

Route::resource('multiple-ideas', MultipleIdeaController::class)
    ->only(['store', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);

// Lists management
Route::middleware('auth')->prefix('lists')->group(function () {
    Route::get('/created',          [GiftListController::class, 'authLists'])->name('lists.authLists');
    Route::get('/followed',         [GiftListController::class, 'followedLists'])->name('lists.followedLists');
    Route::get('/to-follow',        [GiftListController::class, 'listsToFollow'])->name('lists.listsToFollow');
    Route::post('/{list}/follow',   [GiftListController::class, 'followList'])->name('lists.followList');
    Route::patch('/{list}/archive', [GiftListController::class, 'archive'])->name('lists.archive');
    Route::get('/search',           [GiftListController::class, 'search'])->name('lists.search');
});

Route::resource('lists', GiftListController::class)
    ->only(['index', 'create', 'store', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);

Route::get('/lists/{list}', [GiftListController::class, 'show'])->name('lists.show');
Route::post('/lists/{list}/guest-access', [GiftListController::class, 'guestAccess'])
    ->name('lists.guestAccess')
    ->middleware('throttle:10,1');

Route::get('/privatecode', function () {
    return Inertia::render('PrivateCode');
})->middleware(['auth', 'verified'])->name('privatecode');

// Notifications management
Route::middleware('auth')->prefix('notifications')->group(function () {
    Route::get('/all',          [NotificationController::class, 'index']);
    Route::get('/unread',       [NotificationController::class, 'indexUnreadNotifications']);
    Route::patch('/mark/{id}',  [NotificationController::class, 'markNotification']);
    Route::patch('/mark/all',   [NotificationController::class, 'markAllNotifications']);
    Route::delete('/{id}',      [NotificationController::class, 'destroy']);
    Route::post('/request-access/{listOwner}/{list}',       [NotificationController::class, 'requestAccessToList'])->name('notifications.requestAccessToList');
    Route::post('/respond-access/{notificationId}/{list}',  [NotificationController::class, 'respondToAccessRequest'])->name('notifications.respondToAccessRequest');
});

require __DIR__.'/auth.php';
