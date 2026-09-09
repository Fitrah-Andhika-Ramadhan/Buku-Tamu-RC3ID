<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParticipantController extends Controller
{
    public function index()
    {
        $totalParticipants = Participant::count();
        $totalAttending = Participant::where('is_attending', true)->count();

        return Inertia::render('Welcome', [
            'totalParticipants' => $totalParticipants,
            'totalAttending' => $totalAttending,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'wa_number' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'institution' => 'required|string|max:255',
        ]);

        $customResponses = $request->except(['full_name', 'wa_number', 'email', 'institution', '_token']);

        $participant = Participant::create([
            'full_name' => $validated['full_name'],
            'wa_number' => $validated['wa_number'],
            'email' => $validated['email'],
            'institution' => $validated['institution'],
            'custom_responses' => $customResponses,
        ]);

        // Redirect to success page with flash session if needed, but since it's a dedicated page, just redirect.
        // We can pass a simple session flash to prevent direct access if we wanted, but for guestbook, it's fine.
        session()->flash('registered', true);
        return redirect()->route('register.success');
    }

    public function success()
    {
        if (!session('registered')) {
            return redirect('/');
        }
        
        $setting = \App\Models\Setting::where('key', 'success_page_config')->first();
        $config = $setting ? $setting->value : [
            'success_message' => 'Silakan tunjukkan layar ini atau berikan nama Anda kepada staf kami untuk verifikasi kehadiran dan klaim merchandise eksklusif.',
            'e_materi_url' => '#',
            'show_merchandise' => true,
        ];

        return Inertia::render('Auth/Success', [
            'success_config' => $config
        ]);
    }
}
