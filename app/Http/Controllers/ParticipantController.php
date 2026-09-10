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
        $totalInstitutions = Participant::whereNotNull('institution')->where('institution', '!=', '')->distinct('institution')->count('institution');

        $setting = \App\Models\Setting::where('key', 'form_header_config')->first();
        $config = $setting ? $setting->value : [];
        $showWelcomeQr = $config['show_welcome_qr'] ?? true;

        return Inertia::render('Welcome', [
            'totalParticipants' => $totalParticipants,
            'totalAttending' => $totalAttending,
            'totalInstitutions' => $totalInstitutions,
            'showWelcomeQr' => $showWelcomeQr,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
        ]);

        $customResponses = $request->except(['full_name', 'wa_number', 'email', 'institution', '_token']);

        $participant = Participant::create([
            'full_name'   => $request->input('full_name', ''),
            'wa_number'   => $request->input('wa_number', ''),
            'email'       => $request->input('email', ''),
            'institution' => $request->input('institution', ''),
            'custom_responses' => $customResponses,
            'is_attending' => true,
        ]);

        // Store participant ID in session so success page works even after refresh
        session(['last_participant_id' => $participant->id]);
        return redirect()->route('register.success');
    }

    public function success()
    {
        $participantId = session('last_participant_id');
        if (!$participantId) {
            return redirect('/');
        }

        $participant = Participant::find($participantId);
        
        $setting = \App\Models\Setting::where('key', 'success_page_config')->first();
        $config = $setting ? $setting->value : [
            'success_message' => 'Silakan tunjukkan layar ini atau berikan nama Anda kepada staf kami untuk verifikasi kehadiran dan klaim merchandise eksklusif.',
            'e_materi_url' => '#',
            'show_merchandise' => true,
            'tts_enabled' => true,
            'tts_text' => 'Terima kasih sudah mengisi buku tamu kami. Selamat menikmati pameran!',
        ];

        $totalParticipants = Participant::count();
        $totalAttending = Participant::where('is_attending', true)->count();
        $totalInstitutions = Participant::whereNotNull('institution')->where('institution', '!=', '')->distinct('institution')->count('institution');

        $topInstitutionsData = Participant::select('institution as name', \DB::raw('count(*) as count'))
            ->whereNotNull('institution')
            ->where('institution', '!=', '')
            ->groupBy('institution')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        return Inertia::render('Auth/Success', [
            'success_config'      => $config,
            'totalParticipants'   => $totalParticipants,
            'totalAttending'      => $totalAttending,
            'totalInstitutions'   => $totalInstitutions,
            'topInstitutionsData' => $topInstitutionsData,
            'participant'       => $participant ? [
                'id'          => $participant->id,
                'full_name'   => $participant->full_name,
                'institution' => $participant->institution,
                'wa_number'   => $participant->wa_number,
                'is_attending'=> $participant->is_attending,
            ] : null,
        ]);
    }

    public function ticket($id)
    {
        $participant = Participant::findOrFail($id);
        
        return Inertia::render('Ticket', [
            'participant' => [
                'id' => $participant->id,
                'nama_lengkap' => $participant->full_name,
                'instansi' => $participant->institution,
                'wa_number' => $participant->wa_number,
                'is_attending' => $participant->is_attending,
            ]
        ]);
    }
}
