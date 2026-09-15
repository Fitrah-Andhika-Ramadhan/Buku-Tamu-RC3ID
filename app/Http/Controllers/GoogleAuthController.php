<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('google_id', $googleUser->getId())->first();

            if (!$user) {
                // Check if user exists by email
                $user = User::where('email', $googleUser->getEmail())->first();
                if ($user) {
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                    ]);
                } else {
                    $user = User::create([
                        'name' => $googleUser->getName(),
                        'email' => $googleUser->getEmail(),
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                        'role' => 'participant', // They are external participants
                        'password' => null, 
                        'email_verified_at' => now(),
                    ]);
                }
            }

            Auth::login($user, true);

            // Redirect them to the intended meeting room or dashboard
            // For now, redirect to a dashboard (or we will handle intended URLs later)
            return redirect()->intended('/admin'); 

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Google Login Error: ' . $e->getMessage());
            return redirect('/login')->with('error', 'Gagal login dengan Google.');
        }
    }
}
