<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Meeting;
use App\Models\MeetingNote;
use Illuminate\Support\Facades\Auth;

class MeetingController extends Controller
{
    public function show($slug)
    {
        $meeting = Meeting::with('notes')->where('room_slug', $slug)->firstOrFail();
        $user = Auth::user();

        // Ensure user is logged in
        if (!$user) {
            // Should be handled by middleware, but just in case
            return redirect('/login');
        }

        return Inertia::render('MeetingRoom', [
            'meeting' => $meeting,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'role' => $user->role,
            ]
        ]);
    }

    public function saveNotes(Request $request, $id)
    {
        $meeting = Meeting::findOrFail($id);
        
        $request->validate([
            'content_html' => 'required|string'
        ]);

        $note = MeetingNote::firstOrCreate(
            ['meeting_id' => $meeting->id],
            ['content_html' => $request->content_html]
        );

        if (!$note->wasRecentlyCreated) {
            $note->update(['content_html' => $request->content_html]);
        }

        return response()->json(['success' => true]);
    }

    public function generateAiSummary(Request $request, $id)
    {
        $meeting = Meeting::findOrFail($id);
        $request->validate(['content_html' => 'required|string']);

        $apiKey = \App\Models\Setting::where('key', 'openrouter_api_key')->value('value');
        
        if (!$apiKey) {
            return response()->json([
                'success' => false,
                'message' => 'API Key OpenRouter belum diatur.'
            ], 400);
        }

        try {
            $systemPrompt = 'Anda adalah asisten notulensi profesional (AI Meeting Secretary). Tugas Anda adalah membaca catatan kasar rapat dan mengubahnya menjadi notulensi formal yang rapi, terstruktur (menggunakan Markdown), berisi Poin Pembahasan, Keputusan, dan Tindak Lanjut (Action Items). Jawab hanya dengan format Markdown yang rapi.';

            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'HTTP-Referer' => config('app.url'),
            ])->timeout(30)->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => 'google/gemini-2.5-flash',
                'max_tokens' => 2000,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => 'Buatkan kesimpulan rapat dari catatan mentah berikut:\n\n' . $request->content_html]
                ]
            ]);

            if (!$response->successful()) {
                throw new \Exception('Failed to communicate with OpenRouter API');
            }

            $result = $response->json();
            $content = $result['choices'][0]['message']['content'] ?? '';

            // Save the summary
            $note = MeetingNote::firstOrCreate(['meeting_id' => $meeting->id]);
            $note->update(['ai_summary' => trim($content)]);

            return response()->json([
                'success' => true,
                'summary' => trim($content)
            ]);
            
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('AI Summary Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat kesimpulan: ' . $e->getMessage()
            ], 500);
        }
    }
}
