<?php

use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [ParticipantController::class, 'index'])->name('home');
// Legacy routes for compatibility with old QR codes
Route::get('/buku-tamu', [ParticipantController::class, 'registerLegacy'])->name('register');
Route::post('/daftar-tamu', [ParticipantController::class, 'storeLegacy'])->middleware('throttle:10,1')->name('register.store');
Route::get('/success', [ParticipantController::class, 'successLegacy'])->name('register.success');

use App\Http\Controllers\GoogleAuthController;

Route::get('/auth/google', [GoogleAuthController::class, 'redirect'])->name('google.login');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('google.callback');

// New Event-specific routes
Route::get('/e/{slug}/buku-tamu', [ParticipantController::class, 'registerForm'])->name('event.register');
Route::get('/e/{slug}', [ParticipantController::class, 'eventForm'])->name('event.form');
Route::post('/e/{slug}/daftar', [ParticipantController::class, 'store'])->middleware('throttle:10,1')->name('event.store');
Route::get('/e/{slug}/success', [ParticipantController::class, 'success'])->name('event.success');

use App\Http\Controllers\MeetingController;

// Public Meeting routes (Auth check handled inside controller to show Guest Join page)
Route::get('/m/{slug}', [MeetingController::class, 'show'])->name('meeting.room');

Route::middleware(['auth'])->group(function () {
    Route::post('/m/{id}/notes', [MeetingController::class, 'saveNotes'])->name('meeting.notes.save');
    Route::post('/m/{id}/ai-summary', [MeetingController::class, 'generateAiSummary'])->name('meeting.ai');
});

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
    Route::get('/run-migrations-secret', function () {
        try {
            \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
            return redirect('/admin')->with('success', 'Migrasi database berhasil dijalankan di server!');
        } catch (\Exception $e) {
            return redirect('/admin')->with('error', 'Gagal menjalankan migrasi: ' . $e->getMessage());
        }
    });

    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/peserta', [AdminController::class, 'peserta'])->name('admin.peserta');
    Route::post('/peserta/manual', [AdminController::class, 'storeManual'])->name('admin.peserta.manual');
    Route::post('/peserta/scan', [AdminController::class, 'scanDocument'])->name('admin.peserta.scan');
    Route::post('/settings/gemini-key', [AdminController::class, 'saveGeminiKey'])->name('admin.settings.gemini');
    Route::put('/peserta/{id}/toggle', [AdminController::class, 'toggle'])->name('admin.peserta.toggle');
    Route::delete('/peserta/{id}', [AdminController::class, 'destroy'])->name('admin.peserta.destroy');
    
    // Form & Event Management Routes
    Route::post('/events', [AdminController::class, 'storeEvent'])->name('admin.events.store');
    Route::put('/events/{id}', [AdminController::class, 'updateEvent'])->name('admin.events.update');
    Route::post('/events/switch', [AdminController::class, 'switchEvent'])->name('admin.events.switch');
    Route::post('/events/set-front', [AdminController::class, 'setFrontEvent'])->name('admin.events.set-front');
    Route::post('/events/{id}/meeting', [AdminController::class, 'launchMeeting'])->name('admin.events.meeting.launch');
    Route::get('/form-builder', [AdminController::class, 'formBuilder'])->name('admin.form.builder');
    Route::post('/form-builder', [AdminController::class, 'saveFormBuilder'])->name('admin.form.builder.save');
    Route::post('/form-builder/generate-ai', [AdminController::class, 'generateFormAi'])->name('admin.form.builder.generate-ai');
    Route::post('/settings/openrouter-key', [AdminController::class, 'saveOpenRouterKey'])->name('admin.settings.openrouter');
    Route::get('/success-config', [AdminController::class, 'successConfig'])->name('admin.success.config');
    Route::post('/success-config', [AdminController::class, 'saveSuccessConfig'])->name('admin.success.config.save');
    Route::get('/form-header', [AdminController::class, 'formHeaderConfig'])->name('admin.form.header');
    Route::post('/form-header', [AdminController::class, 'saveFormHeaderConfig'])->name('admin.form.header.save');
    Route::get('/landing-config', [AdminController::class, 'landingConfig'])->name('admin.landing.config');
    Route::post('/landing-config', [AdminController::class, 'saveLandingConfig'])->name('admin.landing.config.save');
    Route::post('/scan', [AdminController::class, 'scan'])->name('admin.scan');
    Route::get('/qr-generator', function() {
        return \Inertia\Inertia::render('Admin/QrGenerator');
    })->name('admin.qr.generator');

    // DB SQL Viewer
    Route::get('/db-viewer', [\App\Http\Controllers\DbViewerController::class, 'index'])->name('admin.db.viewer');
    Route::post('/db-viewer', [\App\Http\Controllers\DbViewerController::class, 'index']);
});

require __DIR__.'/auth.php';
