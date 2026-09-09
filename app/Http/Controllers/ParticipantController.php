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

        return redirect()->back()->with('success', 'Pendaftaran berhasil!');
    }
}
