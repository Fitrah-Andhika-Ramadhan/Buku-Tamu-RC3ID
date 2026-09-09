<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], '/check-env') !== false) {
    $envPath = __DIR__ . '/../.env';
    if (file_exists($envPath)) {
        die("File .env DITEMUKAN di: " . $envPath . "<br><br>Isinya:<br>" . nl2br(file_get_contents($envPath)));
    } else {
        die("File .env TIDAK DITEMUKAN di: " . $envPath . "<br><br>Tolong buat file .env di root (sejajar dengan folder app, bootstrap, public).");
    }
}

if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], '/force-migrate') !== false) {
    // try to migrate outside of web middleware
    // we will rely on artisan
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
