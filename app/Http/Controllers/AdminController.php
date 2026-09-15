<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    protected function getCurrentEvent()
    {
        $eventId = \Illuminate\Support\Facades\Session::get('current_event_id');
        if ($eventId) {
            $event = \App\Models\Event::find($eventId);
            if ($event) return $event;
        }
        $event = \App\Models\Event::orderBy('created_at', 'asc')->first();
        if ($event) {
            \Illuminate\Support\Facades\Session::put('current_event_id', $event->id);
            return $event;
        }
        return null;
    }

    public function dashboard()
    {
        try {
            $event = $this->getCurrentEvent();
            if (!$event) {
                return Inertia::render('Admin/Dashboard', ['isDbError' => false, 'totalRegistrants' => 0, 'totalHadir' => 0, 'totalPending' => 0, 'recentParticipants' => []]);
            }

            $totalRegistrants = Participant::where('event_id', $event->id)->count();
            $totalHadir = Participant::where('event_id', $event->id)->where('is_attending', true)->count();
            $totalPending = $totalRegistrants - $totalHadir;
            
            $recentParticipants = Participant::where('event_id', $event->id)
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get(['id', 'full_name as nama_lengkap', 'institution as instansi', 'created_at as createdAt', 'is_attending as status_hadir']);

            return Inertia::render('Admin/Dashboard', [
                'totalRegistrants' => $totalRegistrants,
                'totalHadir' => $totalHadir,
                'totalPending' => $totalPending,
                'recentParticipants' => $recentParticipants,
                'isDbError' => false,
            ]);
        } catch (\Exception $e) {
            Log::error('Admin Dashboard DB Error: ' . $e->getMessage());
            return Inertia::render('Admin/Dashboard', [
                'totalRegistrants' => 0,
                'totalHadir' => 0,
                'totalPending' => 0,
                'recentParticipants' => [],
                'isDbError' => true,
            ]);
        }
    }

    public function peserta()
    {
        try {
            $event = $this->getCurrentEvent();
            if (!$event) {
                return Inertia::render('Admin/Peserta', ['participants' => [], 'formFields' => [], 'isDbError' => false]);
            }

            $participants = Participant::where('event_id', $event->id)->orderBy('created_at', 'desc')->get()->map(function($p) {
                return [
                    'id' => $p->id,
                    'nama_lengkap' => $p->full_name,
                    'instansi' => $p->institution,
                    'profesi' => $p->profession,
                    'status_hadir' => $p->is_attending,
                    'email' => $p->email,
                    'wa_number' => $p->wa_number,
                    'createdAt' => $p->created_at,
                    'custom_responses' => $p->custom_responses,
                    'collaboration' => $p->collaboration,
                    'social_media' => $p->social_media,
                ];
            });
            
            $formFields = $event->form_fields ?? [];

            return Inertia::render('Admin/Peserta', [
                'participants' => $participants,
                'formFields' => $formFields,
                'isDbError' => false,
            ]);
        } catch (\Exception $e) {
            Log::error('Admin Peserta DB Error: ' . $e->getMessage());
            return Inertia::render('Admin/Peserta', [
                'participants' => [],
                'formFields' => [],
                'isDbError' => true,
            ]);
        }
    }

    public function toggle(Request $request, $id)
    {
        try {
            $participant = Participant::findOrFail($id);
            $participant->update([
                'is_attending' => $request->status_hadir,
                // 'waktu_hadir' => $request->status_hadir ? now() : null, // (waktu_hadir doesn't exist in migration, remove or ignore)
            ]);
            
            return back()->with('success', 'Status kehadiran berhasil diubah.');
        } catch (\Exception $e) {
            Log::error('Error toggling participant: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal mengubah status');
        }
    }

    public function destroy($id)
    {
        try {
            $participant = Participant::findOrFail($id);
            $participant->delete();
            return back()->with('success', 'Peserta berhasil dihapus.');
        } catch (\Exception $e) {
            Log::error('Error deleting participant: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal menghapus peserta');
        }
    }

    public function storeManual(Request $request)
    {
        try {
            $validated = $request->validate([
                'full_name' => 'required|string|max:255',
                'wa_number' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'institution' => 'nullable|string|max:255',
                'registration_date' => 'nullable|date',
            ]);

            // Ambil semua data request kecuali field default
            $customResponses = $request->except(['full_name', 'wa_number', 'email', 'institution', 'registration_date', '_token']);

            $participant = new Participant();
            $participant->id = (string) Str::uuid();
            $participant->event_id = $this->getCurrentEvent()->id ?? null;
            $participant->full_name = $validated['full_name'];
            $participant->wa_number = $validated['wa_number'] ?? '-';
            $participant->email = $validated['email'] ?? '-';
            $participant->institution = $validated['institution'] ?? '-';
            $participant->custom_responses = $customResponses;
            $participant->is_attending = true;
            
            if (!empty($validated['registration_date'])) {
                $participant->created_at = $validated['registration_date'];
                $participant->updated_at = $validated['registration_date'];
            }
            
            $participant->save();

            return back()->with('success', 'Peserta manual berhasil ditambahkan.');
        } catch (\Exception $e) {
            Log::error('Error store manual participant: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal menambahkan peserta: ' . $e->getMessage());
        }
    }

    public function formBuilder()
    {
        $event = $this->getCurrentEvent();
        if (!$event) {
            return Inertia::render('Admin/FormBuilder', ['formFields' => []]);
        }

        return Inertia::render('Admin/FormBuilder', [
            'formFields' => $event->form_fields ?? []
        ]);
    }

    public function saveFormBuilder(Request $request)
    {
        $event = $this->getCurrentEvent();
        if (!$event) {
            return redirect()->back()->with('error', 'No active event found.');
        }

        $validated = $request->validate([
            'fields' => 'required|array'
        ]);

        $event->form_fields = $validated['fields'];
        $event->save();

        return redirect()->back()->with('success', 'Form fields saved successfully.');
    }

    public function successConfig()
    {
        $event = $this->getCurrentEvent();
        if (!$event) {
            return Inertia::render('Admin/SuccessConfig', ['config' => []]);
        }
        
        $currentConfig = $event->success_config ?? [];
        return Inertia::render('Admin/SuccessConfig', [
            'config' => !empty($currentConfig) ? $currentConfig : [
                'success_message' => 'Silakan tunjukkan layar ini atau berikan nama Anda kepada staf kami untuk verifikasi kehadiran dan klaim merchandise eksklusif.',
                'e_materi_type' => 'url',
                'e_materi_url' => '',
                'e_materi_file_url' => '',
                'show_merchandise' => true,
                'merchandise_photo_url' => '/merchandise.png',
                'merchandise_items' => [
                    [ 'id' => '1', 'name' => 'Tote Bag', 'desc' => 'Tote bag eksklusif dengan desain minimalis dan logo RC3ID.', 'img' => '/merchandise.png' ],
                    [ 'id' => '2', 'name' => 'Mug Keramik', 'desc' => 'Mug keramik berkualitas dengan logo RC3ID, cocok untuk menemanimu.', 'img' => '/merch2.png' ],
                    [ 'id' => '3', 'name' => 'Lanyard', 'desc' => 'Lanyard eksklusif dengan desain modern dan logo RC3ID.', 'img' => '/merch3.png' ],
                ],
                'tts_enabled' => true,
                'tts_text' => 'Terima kasih sudah mengisi buku tamu kami. Selamat menikmati pameran!',
            ]
        ]);
    }

    public function saveSuccessConfig(Request $request)
    {
        $event = $this->getCurrentEvent();
        if (!$event) {
            return redirect()->back()->with('error', 'No active event found.');
        }

        $validated = $request->validate([
            'success_message' => 'required|string',
            'e_materi_type' => 'required|string|in:url,file',
            'e_materi_url' => 'nullable|string',
            'show_merchandise' => 'required|boolean',
            'tts_enabled' => 'nullable|boolean',
            'tts_text' => 'nullable|string|max:1000',
        ]);

        $currentConfig = $event->success_config ?? [];

        $config = array_merge($currentConfig, $validated);
        $config['show_merchandise'] = filter_var($request->input('show_merchandise', true), FILTER_VALIDATE_BOOLEAN);
        $config['tts_enabled'] = filter_var($request->input('tts_enabled', false), FILTER_VALIDATE_BOOLEAN);
        $config['tts_text'] = $request->input('tts_text', '');
        $config['show_live_stats'] = filter_var($request->input('show_live_stats', false), FILTER_VALIDATE_BOOLEAN);
        $config['show_games_banner'] = filter_var($request->input('show_games_banner', true), FILTER_VALIDATE_BOOLEAN);
        $config['show_digital_ticket'] = filter_var($request->input('show_digital_ticket', true), FILTER_VALIDATE_BOOLEAN);
        $config['stat_tahun_berdiri'] = $request->input('stat_tahun_berdiri', '2017');
        $config['stat_kelompok_riset'] = $request->input('stat_kelompok_riset', '3');
        $config['stat_publikasi'] = $request->input('stat_publikasi', '100+');
        $config['stat_nama_univ'] = $request->input('stat_nama_univ', 'UNPAD');

        if ($request->hasFile('e_materi_file')) {
            $file = $request->file('e_materi_file');
            $filename = time() . '_' . str_replace(' ', '_', $file->getClientOriginalName());
            $file->move(public_path('materi'), $filename);
            $config['e_materi_file_url'] = '/materi/' . $filename;
        }

        $config['merchandise_display_mode'] = $request->input('merchandise_display_mode', 'carousel');
        $config['merchandise_photo_title'] = $request->input('merchandise_photo_title', 'Koleksi Merchandise');
        $config['merchandise_photo_desc'] = $request->input('merchandise_photo_desc', 'Dapatkan Tote Bag, Mug Keramik, atau Lanyard edisi terbatas khusus pengunjung booth. Silakan tunjukkan halaman ini ke staf kami.');

        if ($request->hasFile('merchandise_photo')) {
            $file = $request->file('merchandise_photo');
            $filename = time() . '_single_' . str_replace(' ', '_', $file->getClientOriginalName());
            $file->move(public_path('merchandise'), $filename);
            $config['merchandise_photo_url'] = '/merchandise/' . $filename;
        }

        $merchandiseItems = $request->input('merchandise_items');
        if (is_array($merchandiseItems)) {
            $processedItems = [];
            foreach ($merchandiseItems as $index => $item) {
                // If a new file is uploaded for this item
                if ($request->hasFile("merchandise_items.{$index}.file")) {
                    $file = $request->file("merchandise_items.{$index}.file");
                    $filename = time() . '_' . $index . '_' . str_replace(' ', '_', $file->getClientOriginalName());
                    $file->move(public_path('merchandise'), $filename);
                    $item['img'] = '/merchandise/' . $filename;
                }
                // Remove the file object from the item array before saving to JSON
                unset($item['file']);
                $processedItems[] = $item;
            }
            $config['merchandise_items'] = $processedItems;
        }

        $event->success_config = $config;
        $event->save();

        // Flush cached config so frontend sees updated settings immediately
        \Illuminate\Support\Facades\Cache::forget('success_page_config_' . $event->id);

        return redirect()->back()->with('success', 'Success page settings saved successfully.');
    }

    public function landingConfig()
    {
        $event = $this->getCurrentEvent();
        if (!$event) {
            return Inertia::render('Admin/LandingConfig', ['config' => []]);
        }
        
        $currentConfig = $event->landing_config ?? [];
        return Inertia::render('Admin/LandingConfig', [
            'config' => !empty($currentConfig) ? $currentConfig : [
                'badge_text' => 'RC3ID pada B-IDEAs 2026 Exhibition',
                'title_line1' => 'ADVANCING',
                'title_gradient' => 'EARLY DETECTION',
                'title_line2' => 'FOR BETTER INFECTIOUS DISEASE CONTROL',
                'description_html' => '<strong>RC3ID UNPAD</strong> hadir di <strong>B-IDEAs 2026 Exhibition</strong> membawa inovasi riset deteksi dini penyakit infeksi — Tuberkulosis, HIV, dan Dengue.<br/> Daftarkan diri Anda dan langsung <strong class="text-[#BD272D]">klaim merchandise</strong> riset kami!',
            ]
        ]);
    }

    public function saveLandingConfig(Request $request)
    {
        $event = $this->getCurrentEvent();
        if (!$event) {
            return redirect()->back()->with('error', 'No active event found.');
        }

        $validated = $request->validate([
            'badge_text' => 'nullable|string',
            'title_line1' => 'nullable|string',
            'title_gradient' => 'nullable|string',
            'title_line2' => 'nullable|string',
            'description_html' => 'nullable|string',
        ]);

        $event->landing_config = $validated;
        $event->save();

        return redirect()->back()->with('success', 'Landing page settings saved successfully.');
    }

    public function formHeaderConfig()
    {
        $event = $this->getCurrentEvent();
        if (!$event) {
            return Inertia::render('Admin/FormHeaderConfig', ['config' => []]);
        }
        
        $currentConfig = $event->form_header ?? [];
        return Inertia::render('Admin/FormHeaderConfig', [
            'config' => !empty($currentConfig) ? $currentConfig : [
                'title_line1' => 'Form Buku Tamu',
                'title_line2' => 'Booth RC3ID',
                'description' => "Selamat datang di booth Research Center for Care and Control of Infectious Diseases (RC3ID) Universitas Padjadjaran di 11th BIDEAS 2026!\n\nKami mengundang Anda untuk terhubung dengan inovasi riset klinis dan inisiatif edukasi publik kami dalam pengendalian penyakit infeksi.\n\nSilakan lengkapi informasi di bawah ini untuk klaim merchandise eksklusif dari booth kami. Data yang Anda berikan akan dijaga kerahasiaannya.",
                'social_links' => [
                    ['emoji' => '🌐', 'label' => 'rc3id.unpad.ac.id', 'url' => 'https://rc3id.unpad.ac.id'],
                    ['emoji' => '📸', 'label' => '@rc3id.unpad', 'url' => 'https://instagram.com/rc3id.unpad'],
                    ['emoji' => '💼', 'label' => 'LinkedIn RC3ID', 'url' => 'https://linkedin.com/company/research-center-for-care-and-control-of-infectious-diseases/'],
                    ['emoji' => '🎥', 'label' => 'YouTube RC3ID', 'url' => 'https://youtube.com/@RC3IDUniversitasPadjadjaran'],
                    ['emoji' => '🐦', 'label' => '@RC3IDUnpad', 'url' => 'https://x.com/RC3IDUnpad'],
                ],
                'show_banner' => true,
                'show_welcome_qr' => true,
                'banner_image_path' => null,
            ]
        ]);
    }

    public function saveFormHeaderConfig(Request $request)
    {
        $event = $this->getCurrentEvent();
        if (!$event) {
            return redirect()->back()->with('error', 'No active event found.');
        }

        $currentConfig = $event->form_header ?? [];

        $bannerPath = $currentConfig['banner_image_path'] ?? null;
        if ($request->hasFile('banner_image')) {
            $file = $request->file('banner_image');
            $filename = time() . '_' . str_replace(' ', '_', $file->getClientOriginalName());
            $file->move(public_path('banners'), $filename);
            $bannerPath = '/banners/' . $filename;
        }

        $config = [
            'title_line1' => $request->input('title_line1', 'Form Buku Tamu'),
            'title_line2' => $request->input('title_line2', 'Booth RC3ID'),
            'description' => $request->input('description', ''),
            'social_links' => $request->input('social_links', []),
            'show_banner' => filter_var($request->input('show_banner', true), FILTER_VALIDATE_BOOLEAN),
            'show_welcome_qr' => filter_var($request->input('show_welcome_qr', true), FILTER_VALIDATE_BOOLEAN),
            'banner_image_path' => $bannerPath,
        ];

        $event->form_header = $config;
        $event->save();

        return redirect()->back()->with('success', 'Form header settings saved successfully.');
    }

    public function storeEvent(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $event = new \App\Models\Event();
        $event->id = (string) Str::uuid();
        $event->name = $validated['name'];
        $event->slug = Str::slug($validated['name']) . '-' . rand(100, 999);
        $event->is_active = true;
        
        // Copy defaults from current event if any
        $current = $this->getCurrentEvent();
        if ($current) {
            $event->form_fields = $current->form_fields;
            $event->form_header = $current->form_header;
            $event->success_config = $current->success_config;
        } else {
            $event->form_fields = [];
            $event->form_header = [];
            $event->success_config = [];
        }
        
        $event->save();

        \Illuminate\Support\Facades\Session::put('current_event_id', $event->id);

        return redirect()->back()->with('success', 'Form baru berhasil dibuat.');
    }

    public function switchEvent(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|uuid|exists:events,id',
        ]);

        \Illuminate\Support\Facades\Session::put('current_event_id', $validated['event_id']);

        return redirect()->back()->with('success', 'Berhasil beralih form.');
    }

    public function setFrontEvent(Request $request)
    {
        $request->validate(['event_id' => 'required']);

        Setting::updateOrCreate(
            ['key' => 'front_event_id'],
            ['value' => $request->event_id]
        );

        return redirect()->back()->with('success', 'Front event berhasil diatur.');
    }

    public function scanDocument(Request $request)
    {
        $request->validate([
            'document' => 'required|image|max:10240' // max 10MB
        ]);

        try {
            $ocrService = new \App\Services\OcrService();
            $result = $ocrService->scanDocument($request->file('document'));
            
            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Exception $e) {
            $errorCode = $e->getMessage() === 'API_KEY_MISSING' ? 'API_KEY_MISSING' : 'GENERAL_ERROR';
            return response()->json([
                'success' => false,
                'error_code' => $errorCode,
                'message' => $e->getMessage() === 'API_KEY_MISSING' 
                    ? 'API Key Gemini belum diatur.' 
                    : $e->getMessage()
            ], $errorCode === 'API_KEY_MISSING' ? 400 : 500);
        }
    }

    public function saveGeminiKey(Request $request)
    {
        $request->validate([
            'key' => 'required|string'
        ]);

        Setting::updateOrCreate(
            ['key' => 'gemini_api_key'],
            ['value' => $request->key]
        );

        return response()->json(['success' => true]);
    }
    public function saveOpenRouterKey(Request $request)
    {
        $request->validate([
            'key' => 'required|string'
        ]);

        Setting::updateOrCreate(
            ['key' => 'openrouter_api_key'],
            ['value' => $request->key]
        );

        return response()->json(['success' => true]);
    }

    public function generateFormAi(Request $request)
    {
        $request->validate([
            'prompt' => 'required|string|max:1000'
        ]);

        $apiKey = Setting::where('key', 'openrouter_api_key')->value('value');
        
        if (!$apiKey) {
            return response()->json([
                'success' => false,
                'error_code' => 'API_KEY_MISSING',
                'message' => 'API Key OpenRouter belum diatur.'
            ], 400);
        }

        try {
            $systemPrompt = 'You are an AI that generates form fields. Always respond in valid JSON format only, without markdown wrappers like ```json. Return an object with a "fields" array. Each field MUST have: id (unique string timestamp), type (text, email, tel, textarea, radio, checkbox), label (string), name (string, lowercase snake_case), required (boolean), options (array of strings, only for radio/checkbox, leave empty otherwise). Example: {"fields": [{"id":"123","type":"text","label":"Nama","name":"nama","required":true}]}';

            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'HTTP-Referer' => config('app.url'),
            ])->timeout(30)->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => 'google/gemini-2.5-flash',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $systemPrompt
                    ],
                    [
                        'role' => 'user',
                        'content' => 'Buatkan field untuk: ' . $request->prompt
                    ]
                ]
            ]);

            if (!$response->successful()) {
                throw new \Exception('Failed to communicate with OpenRouter API: ' . $response->body());
            }

            $result = $response->json();
            $content = $result['choices'][0]['message']['content'] ?? '';
            
            // Cleanup markdown if AI ignores the instruction
            $content = preg_replace('/```json\s*/', '', $content);
            $content = preg_replace('/```\s*/', '', $content);
            $content = trim($content);

            $data = json_decode($content, true);

            if (!isset($data['fields']) || !is_array($data['fields'])) {
                throw new \Exception('Invalid JSON format received from AI.');
            }

            return response()->json([
                'success' => true,
                'data' => $data['fields']
            ]);
            
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('AI Form Generation Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error_code' => 'GENERAL_ERROR',
                'message' => 'Gagal membuat form: ' . $e->getMessage()
            ], 500);
        }
    }
}
