<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

if (isset($_SERVER['REQUEST_URI'])) {
    if (strpos($_SERVER['REQUEST_URI'], '/check-env') !== false) {
        $envPath = __DIR__ . '/../.env';
        if (file_exists($envPath)) {
            die("File .env DITEMUKAN di: " . $envPath . "<br><br>Isinya:<br>" . nl2br(file_get_contents($envPath)));
        } else {
            die("File .env TIDAK DITEMUKAN.");
        }
    }
    
    if (strpos($_SERVER['REQUEST_URI'], '/force-cache') !== false) {
        require __DIR__.'/../vendor/autoload.php';
        $app = require_once __DIR__.'/../bootstrap/app.php';
        $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
        $kernel->bootstrap();
        \Illuminate\Support\Facades\Artisan::call('config:cache');
        die("Config Cache berhasil dibuat! Silakan buka /force-migrate sekarang.");
    }

    if (strpos($_SERVER['REQUEST_URI'], '/force-migrate') !== false) {
        require __DIR__.'/../vendor/autoload.php';
        $app = require_once __DIR__.'/../bootstrap/app.php';
        $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
        $kernel->bootstrap();
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        die("Migrasi MySQL Berhasil! Output: " . \Illuminate\Support\Facades\Artisan::output());
    }
}

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
