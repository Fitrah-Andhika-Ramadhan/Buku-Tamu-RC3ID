<?php

use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [ParticipantController::class, 'index'])->name('home');
// Rate limit: max 10 submissions per minute per IP — prevents spam/flood
Route::post('/daftar-tamu', [ParticipantController::class, 'store'])->middleware('throttle:10,1')->name('register.store');
Route::get('/success', [ParticipantController::class, 'success'])->name('register.success');
Route::get('/p/{id}', [ParticipantController::class, 'ticket'])->name('ticket');

use App\Http\Controllers\AdminController;

Route::get('/install', function () {
    $output = [];
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        $output[] = '✅ Migrate: ' . trim(\Illuminate\Support\Facades\Artisan::output());
    } catch (\Exception $e) {
        $output[] = '❌ Migrate gagal: ' . $e->getMessage();
    }
    try {
        \Illuminate\Support\Facades\Artisan::call('optimize');
        $output[] = '✅ Optimize: Route & config cache berhasil dikompilasi.';
    } catch (\Exception $e) {
        $output[] = '⚠️ Optimize: ' . $e->getMessage();
    }
    return '<pre style="font-family:monospace;padding:2rem;background:#f0f9ff;border-radius:8px">'
        . '<b>🚀 Setup RC3ID Selesai!</b>' . "\n\n"
        . implode("\n", $output)
        . "\n\n<i>Halaman ini bisa ditutup.</i></pre>";
});

Route::get('/bersih-cache', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('optimize:clear');
        $output = trim(\Illuminate\Support\Facades\Artisan::output());
        return '<pre style="font-family:monospace;padding:2rem;background:#fff7ed;border-radius:8px">'
            . '🧹 Cache berhasil dibersihkan!' . "\n\n" . $output
            . '</pre>';
    } catch (\Exception $e) {
        return 'Gagal: ' . $e->getMessage();
    }
});


Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/peserta', [AdminController::class, 'peserta'])->name('admin.peserta');
    Route::put('/peserta/{id}/toggle', [AdminController::class, 'toggle'])->name('admin.peserta.toggle');
    Route::delete('/peserta/{id}', [AdminController::class, 'destroy'])->name('admin.peserta.destroy');
    
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
