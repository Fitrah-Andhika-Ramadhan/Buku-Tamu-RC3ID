<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $events = [];
        $currentEvent = null;
        
        if ($request->user()) {
            $events = \App\Models\Event::orderBy('created_at', 'asc')->get();
            $eventId = \Illuminate\Support\Facades\Session::get('current_event_id');
            if ($eventId) {
                $currentEvent = $events->firstWhere('id', $eventId);
            }
            if (!$currentEvent && $events->isNotEmpty()) {
                $currentEvent = $events->first();
                \Illuminate\Support\Facades\Session::put('current_event_id', $currentEvent->id);
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'events' => $events,
            'currentEvent' => $currentEvent,
        ];
    }
}
