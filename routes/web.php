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

Route::get('/check-env', function () {
    $envPath = base_path('.env');
    if (file_exists($envPath)) {
        return "File .env DITEMUKAN di: " . $envPath . "<br><br>Isinya:<br>" . nl2br(file_get_contents($envPath));
    } else {
        return "File .env TIDAK DITEMUKAN di: " . $envPath . "<br><br>Tolong buat file .env di folder public_html (sejajar dengan folder app, bootstrap, public).";
    }
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
