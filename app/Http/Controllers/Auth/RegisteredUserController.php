<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        $setting = \App\Models\Setting::where('key', 'guestbook_form_fields')->first();
        $headerSetting = \App\Models\Setting::where('key', 'form_header_config')->first();

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
            'formFields' => $setting ? $setting->value : [],
            'formHeader' => $headerSetting ? $headerSetting->value : $defaultHeader,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
