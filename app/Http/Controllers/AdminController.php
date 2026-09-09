<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    public function dashboard()
    {
        try {
            $totalRegistrants = Participant::count();
            $totalHadir = Participant::where('is_attending', true)->count();
            $totalPending = $totalRegistrants - $totalHadir;
            
            $recentParticipants = Participant::orderBy('created_at', 'desc')
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
            $participants = Participant::orderBy('created_at', 'desc')->get()->map(function($p) {
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
            
            return Inertia::render('Admin/Peserta', [
                'participants' => $participants,
                'isDbError' => false,
            ]);
        } catch (\Exception $e) {
            Log::error('Admin Peserta DB Error: ' . $e->getMessage());
            return Inertia::render('Admin/Peserta', [
                'participants' => [],
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

    public function formBuilder()
    {
        $setting = Setting::firstOrCreate(
            ['key' => 'guestbook_form_fields'],
            ['value' => []]
        );

        return Inertia::render('Admin/FormBuilder', [
            'formFields' => $setting->value ?? []
        ]);
    }

    public function saveFormBuilder(Request $request)
    {
        $validated = $request->validate([
            'fields' => 'required|array'
        ]);

        Setting::updateOrCreate(
            ['key' => 'guestbook_form_fields'],
            ['value' => $validated['fields']]
        );

        return redirect()->back()->with('success', 'Form fields saved successfully.');
    }

    public function successConfig()
    {
        $setting = Setting::where('key', 'success_page_config')->first();
        return Inertia::render('Admin/SuccessConfig', [
            'config' => $setting ? $setting->value : [
                'success_message' => 'Silakan tunjukkan layar ini atau berikan nama Anda kepada staf kami untuk verifikasi kehadiran dan klaim merchandise eksklusif.',
                'e_materi_type' => 'url',
                'e_materi_url' => '',
                'e_materi_file_url' => '',
                'show_merchandise' => true,
                'merchandise_photo_url' => '/merchandise.png',
                'tts_enabled' => true,
                'tts_text' => 'Terima kasih sudah mengisi buku tamu kami. Selamat menikmati pameran!',
            ]
        ]);
    }

    public function saveSuccessConfig(Request $request)
    {
        $validated = $request->validate([
            'success_message' => 'required|string',
            'e_materi_type' => 'required|string|in:url,file',
            'e_materi_url' => 'nullable|string',
            'show_merchandise' => 'required|boolean',
            'tts_enabled' => 'nullable|boolean',
            'tts_text' => 'nullable|string|max:1000',
        ]);

        $setting = Setting::where('key', 'success_page_config')->first();
        $currentConfig = $setting ? $setting->value : [];

        $config = array_merge($currentConfig, $validated);
        $config['tts_enabled'] = filter_var($request->input('tts_enabled', false), FILTER_VALIDATE_BOOLEAN);
        $config['tts_text'] = $request->input('tts_text', '');

        if ($request->hasFile('e_materi_file')) {
            $path = $request->file('e_materi_file')->store('public/materi');
            $config['e_materi_file_url'] = \Illuminate\Support\Facades\Storage::url($path);
        }

        if ($request->hasFile('merchandise_photo')) {
            $path = $request->file('merchandise_photo')->store('public/merchandise');
            $config['merchandise_photo_url'] = \Illuminate\Support\Facades\Storage::url($path);
        }

        Setting::updateOrCreate(
            ['key' => 'success_page_config'],
            ['value' => $config]
        );

        return redirect()->back()->with('success', 'Success page settings saved successfully.');
    }

    public function formHeaderConfig()
    {
        $setting = Setting::where('key', 'form_header_config')->first();
        return Inertia::render('Admin/FormHeaderConfig', [
            'config' => $setting ? $setting->value : [
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
                'banner_image_path' => null,
            ]
        ]);
    }

    public function saveFormHeaderConfig(Request $request)
    {
        $setting = Setting::where('key', 'form_header_config')->first();
        $currentConfig = $setting ? $setting->value : [];

        $bannerPath = $currentConfig['banner_image_path'] ?? null;
        if ($request->hasFile('banner_image')) {
            $path = $request->file('banner_image')->store('banners', 'public');
            $bannerPath = '/storage/' . $path;
        }

        $config = [
            'title_line1' => $request->input('title_line1', 'Form Buku Tamu'),
            'title_line2' => $request->input('title_line2', 'Booth RC3ID'),
            'description' => $request->input('description', ''),
            'social_links' => $request->input('social_links', []),
            'show_banner' => filter_var($request->input('show_banner', true), FILTER_VALIDATE_BOOLEAN),
            'banner_image_path' => $bannerPath,
        ];

        Setting::updateOrCreate(
            ['key' => 'form_header_config'],
            ['value' => $config]
        );

        return redirect()->back()->with('success', 'Form header settings saved successfully.');
    }
}
