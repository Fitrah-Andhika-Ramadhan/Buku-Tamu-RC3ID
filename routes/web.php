<?php

use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [ParticipantController::class, 'index'])->name('home');
Route::post('/register', [ParticipantController::class, 'store'])->name('register.store');

use App\Http\Controllers\AdminController;

Route::get('/debug', function () {
    $logFile = storage_path('logs/laravel.log');
    if (file_exists($logFile)) {
        return nl2br(file_get_contents($logFile));
    }
    return 'Log file not found.';
});

Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/peserta', [AdminController::class, 'peserta'])->name('admin.peserta');
    Route::put('/peserta/{id}/toggle', [AdminController::class, 'toggle'])->name('admin.peserta.toggle');
    
    // Add these later if needed:
    // Route::get('/form', [AdminController::class, 'form'])->name('admin.form');
    // Route::get('/qr', [AdminController::class, 'qr'])->name('admin.qr');
});

require __DIR__.'/auth.php';
