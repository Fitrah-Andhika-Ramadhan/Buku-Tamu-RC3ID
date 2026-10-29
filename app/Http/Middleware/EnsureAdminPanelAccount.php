<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminPanelAccount
{
    public function handle(Request $request, Closure $next): Response
    {
        abort_if($request->user()?->role === 'zoom_manager', 403, 'Akun ini hanya memiliki akses ke Jadwal & Zoom.');

        return $next($request);
    }
}
