<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureZoomTrackerAccount
{
    public function handle(Request $request, Closure $next): Response
    {
        abort_unless($request->user()?->role === 'zoom_manager', 403, 'Fitur ini hanya tersedia untuk akun khusus Zoom.');

        return $next($request);
    }
}
