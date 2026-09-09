<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/install', function () {
    try {
        Artisan::call('migrate', ['--force' => true]);
        return response()->json(['message' => 'Tabel database berhasil dibuat!', 'output' => Artisan::output()]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()]);
    }
});
