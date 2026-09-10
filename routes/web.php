<?php

use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [ParticipantController::class, 'index'])->name('home');
Route::post('/daftar-tamu', [ParticipantController::class, 'store'])->name('register.store');
Route::get('/success', [ParticipantController::class, 'success'])->name('register.success');
Route::get('/p/{id}', [ParticipantController::class, 'ticket'])->name('ticket');

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
    Route::get('/success-config', [AdminController::class, 'successConfig'])->name('admin.success.config');
    Route::post('/success-config', [AdminController::class, 'saveSuccessConfig'])->name('admin.success.config.save');
    Route::get('/form-header', [AdminController::class, 'formHeaderConfig'])->name('admin.form.header');
    Route::post('/form-header', [AdminController::class, 'saveFormHeaderConfig'])->name('admin.form.header.save');
    Route::post('/scan', [AdminController::class, 'scan'])->name('admin.scan');
    Route::get('/qr-generator', function() {
        return \Inertia\Inertia::render('Admin/QrGenerator');
    })->name('admin.qr.generator');

    // DB SQL Viewer
    Route::get('/db-viewer', [\App\Http\Controllers\DbViewerController::class, 'index'])->name('admin.db.viewer');
    Route::post('/db-viewer', [\App\Http\Controllers\DbViewerController::class, 'index']);
});

require __DIR__.'/auth.php';
