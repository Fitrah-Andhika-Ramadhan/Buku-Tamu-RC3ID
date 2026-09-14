<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ParticipantController extends Controller
{
    public function index()
    {
        $frontEventId = \App\Models\Setting::where('key', 'front_event_id')->value('value');
        if ($frontEventId) {
            $event = Event::find($frontEventId);
        } else {
            $event = Event::where('is_active', true)->orderBy('created_at', 'asc')->first();
        }
        
        if (!$event) {
            return Inertia::render('Welcome', ['event' => null, 'totalParticipants' => 0, 'totalAttending' => 0, 'totalInstitutions' => 0, 'showWelcomeQr' => false]);
        }
        return $this->renderEvent($event);
    }

    public function eventForm($slug)
    {
        $event = Event::where('slug', $slug)->firstOrFail();
        if (!$event->is_active) abort(404, 'Event is no longer active.');
        return $this->renderEvent($event);
    }

    public function registerLegacy()
    {
        $frontEventId = \App\Models\Setting::where('key', 'front_event_id')->value('value');
        if ($frontEventId) {
            $event = Event::find($frontEventId);
        } else {
            $event = Event::where('is_active', true)->orderBy('created_at', 'asc')->first();
        }
        
        if (!$event) abort(404);
        return $this->renderRegister($event, 'register.store');
    }

    public function registerForm($slug)
    {
        $event = Event::where('slug', $slug)->firstOrFail();
        if (!$event->is_active) abort(404, 'Event is no longer active.');
        return $this->renderRegister($event, 'event.store', ['slug' => $slug]);
    }

    protected function renderRegister(Event $event, $submitRoute, $routeParams = [])
    {
        $defaultHeader = [
            'title_line1' => 'Form Buku Tamu',
            'title_line2' => 'Booth RC3ID',
            'description' => "Selamat datang di booth Research Center for Care and Control of Infectious Diseases (RC3ID) Universitas Padjadjaran di 11th BIDEAS 2026!\n\nKami mengundang Anda untuk terhubung dengan inovasi riset klinis dan inisiatif edukasi publik kami dalam pengendalian penyakit infeksi.\n\nSilakan lengkapi informasi di bawah ini untuk klaim merchandise eksklusif dari booth kami. Data yang Anda berikan akan dijaga kerahasiaannya.",
            'social_links' => [
                ['emoji' => '🌐', 'label' => 'rc3id.unpad.ac.id', 'url' => 'https://rc3id.unpad.ac.id'],
                ['emoji' => '📸', 'label' => '@rc3id.unpad', 'url' => 'https://instagram.com/rc3id.unpad'],
                ['emoji' => '💼', 'label' => 'LinkedIn RC3ID', 'url' => 'https://linkedin.com/company/research-center-for-care-and-control-of-infectious-diseases/'],
                ['emoji' => '🎥', 'label' => 'YouTube RC3ID', 'url' => 'https://youtube.com/@RC3IDUniversitasPadjadjaran'],
                ['emoji' => '🐦', 'label' => '@RC3IDUnpad', 'url' => 'https://x.com/RC3IDUnpad'],
            ]
        ];

        return Inertia::render('Auth/Register', [
            'formFields' => $event->form_fields ?? [],
            'formHeader' => !empty($event->form_header) ? $event->form_header : $defaultHeader,
            'submitUrl'  => route($submitRoute, $routeParams),
        ]);
    }

    protected function renderEvent(Event $event)
    {
        $eventId = $event->id;
        $totalParticipants  = Cache::remember("stat_total_participants_{$eventId}", 60, fn() => Participant::where('event_id', $eventId)->count());
        $totalAttending     = Cache::remember("stat_total_attending_{$eventId}", 60, fn() => Participant::where('event_id', $eventId)->where('is_attending', true)->count());
        $totalInstitutions  = Cache::remember("stat_total_institutions_{$eventId}", 60, fn() =>
            Participant::where('event_id', $eventId)->whereNotNull('institution')->where('institution', '!=', '')->distinct('institution')->count('institution')
        );

        $config = $event->form_header ?? [];
        $showWelcomeQr = $config['show_welcome_qr'] ?? true;

        return Inertia::render('Welcome', [
            'event'             => $event,
            'totalParticipants' => $totalParticipants,
            'totalAttending'    => $totalAttending,
            'totalInstitutions' => $totalInstitutions,
            'showWelcomeQr'     => $showWelcomeQr,
        ]);
    }

    public function storeLegacy(Request $request)
    {
        $event = Event::where('is_active', true)->orderBy('created_at', 'asc')->first();
        if (!$event) abort(404);
        return $this->processStore($request, $event, 'register.success');
    }

    public function store(Request $request, $slug)
    {
        $event = Event::where('slug', $slug)->firstOrFail();
        return $this->processStore($request, $event, 'event.success', ['slug' => $slug]);
    }

    protected function processStore(Request $request, Event $event, $successRoute, $routeParams = [])
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
        ]);

        $customResponses = $request->except(['full_name', 'wa_number', 'email', 'institution', '_token']);

        $participant = Participant::create([
            'event_id'         => $event->id,
            'full_name'        => $request->input('full_name', ''),
            'wa_number'        => $request->input('wa_number', ''),
            'email'            => $request->input('email', ''),
            'institution'      => $request->input('institution') ?? '',
            'custom_responses' => $customResponses,
            'is_attending'     => true,
        ]);

        Cache::forget("stat_total_participants_{$event->id}");
        Cache::forget("stat_total_attending_{$event->id}");
        Cache::forget("stat_total_institutions_{$event->id}");
        Cache::forget("stat_top_institutions_{$event->id}");

        session(['last_participant_id' => $participant->id]);
        return redirect()->route($successRoute, $routeParams);
    }

    public function successLegacy()
    {
        return $this->processSuccess();
    }

    public function success($slug)
    {
        return $this->processSuccess($slug);
    }

    protected function processSuccess($slug = null)
    {
        $participantId = session('last_participant_id');
        if (!$participantId) {
            return redirect($slug ? route('event.form', ['slug' => $slug]) : '/');
        }

        $participant = Participant::with('event')->find($participantId);
        if (!$participant || !$participant->event) {
            return redirect('/');
        }
        $event = $participant->event;
        $eventId = $event->id;

        $config = $event->success_config ?? [
            'success_message' => 'Silakan tunjukkan layar ini atau berikan nama Anda kepada staf kami untuk verifikasi kehadiran dan klaim merchandise eksklusif.',
            'e_materi_url'    => '#',
            'show_merchandise'=> true,
            'tts_enabled'     => true,
            'tts_text'        => 'Terima kasih sudah mengisi buku tamu kami. Selamat menikmati pameran!',
        ];

        // Cache all stat queries — heavy queries only run once per 60 seconds total
        $totalParticipants = Cache::remember('stat_total_participants', 60, fn() => Participant::count());
        $totalAttending    = Cache::remember('stat_total_attending', 60, fn() => Participant::where('is_attending', true)->count());
        $totalInstitutions = Cache::remember('stat_total_institutions', 60, fn() =>
            Participant::whereNotNull('institution')->where('institution', '!=', '')->distinct('institution')->count('institution')
        );
        $topInstitutionsData = Cache::remember('stat_top_institutions', 60, fn() =>
            Participant::select('institution as name', \DB::raw('count(*) as count'))
                ->whereNotNull('institution')
                ->where('institution', '!=', '')
                ->groupBy('institution')
                ->orderByDesc('count')
                ->limit(10)
                ->get()
        );

        return Inertia::render('Auth/Success', [
            'success_config'      => $config,
            'totalParticipants'   => $totalParticipants,
            'totalAttending'      => $totalAttending,
            'totalInstitutions'   => $totalInstitutions,
            'topInstitutionsData' => $topInstitutionsData,
            'participant'         => $participant ? [
                'id'           => $participant->id,
                'full_name'    => $participant->full_name,
                'institution'  => $participant->institution,
                'wa_number'    => $participant->wa_number,
                'is_attending' => $participant->is_attending,
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
