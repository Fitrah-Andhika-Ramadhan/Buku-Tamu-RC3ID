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
            'email' => 'nullable|email|max:255',
            'institution' => 'required|string|max:255',
            'profession' => 'nullable|string|max:255',
            'collaboration' => 'nullable|string|max:255',
        ]);

        $participant = Participant::create($validated);

        return redirect()->back()->with('success', 'Pendaftaran berhasil!');
    }
}
