<?php

use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [ParticipantController::class, 'index'])->name('home');
Route::post('/register', [ParticipantController::class, 'store'])->name('register.store');

use App\Http\Controllers\AdminController;

Route::get('/install', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        return 'Tabel database MYSQL berhasil dibuat! Output: ' . \Illuminate\Support\Facades\Artisan::output();
    } catch (\Exception $e) {
        return 'Gagal: ' . $e->getMessage();
    }
});


Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/peserta', [AdminController::class, 'peserta'])->name('admin.peserta');
    Route::put('/peserta/{id}/toggle', [AdminController::class, 'toggle'])->name('admin.peserta.toggle');
    
    // Form Builder Routes
    Route::get('/form-builder', [AdminController::class, 'formBuilder'])->name('admin.form.builder');
    Route::post('/form-builder', [AdminController::class, 'saveFormBuilder'])->name('admin.form.builder.save');
});

require __DIR__.'/auth.php';
