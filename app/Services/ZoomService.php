<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Exception;

class ZoomService
{
    protected $accountId;
    protected $clientId;
    protected $clientSecret;
    protected $authUrl = 'https://zoom.us/oauth/token';
    protected $apiUrl = 'https://api.zoom.us/v2';

    public function __construct()
    {
        $this->accountId = env('ZOOM_ACCOUNT_ID');
        $this->clientId = env('ZOOM_CLIENT_ID');
        $this->clientSecret = env('ZOOM_CLIENT_SECRET');
    }

    /**
     * Get Server-to-Server OAuth Token
     */
    protected function getAccessToken()
    {
        if (Cache::has('zoom_access_token')) {
            return Cache::get('zoom_access_token');
        }

        $response = Http::withBasicAuth($this->clientId, $this->clientSecret)
            ->asForm()
            ->post($this->authUrl, [
                'grant_type' => 'account_credentials',
                'account_id' => $this->accountId,
            ]);

        if ($response->successful()) {
            $data = $response->json();
            $token = $data['access_token'];
            $expiresIn = $data['expires_in'] - 60; // Buffer 1 minute
            
            Cache::put('zoom_access_token', $token, now()->addSeconds($expiresIn));
            
            return $token;
        }

        throw new Exception('Gagal mendapatkan token Zoom: ' . $response->body());
    }

    /**
     * Create a new Meeting
     */
    public function createMeeting($topic, $duration = 60, $agenda = '')
    {
        $token = $this->getAccessToken();

        $response = Http::withToken($token)
            ->post("{$this->apiUrl}/users/me/meetings", [
                'topic' => $topic,
                'type' => 2, // Scheduled meeting
                'duration' => $duration,
                'agenda' => $agenda,
                'settings' => [
                    'host_video' => true,
                    'participant_video' => true,
                    'join_before_host' => false,
                    'mute_upon_entry' => true,
                    'waiting_room' => true,
                ]
            ]);

        if ($response->successful()) {
            return $response->json();
        }

        throw new Exception('Gagal membuat meeting Zoom: ' . $response->body());
    }
}
