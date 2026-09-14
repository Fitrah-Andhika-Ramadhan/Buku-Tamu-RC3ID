<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OcrService
{
    /**
     * Scan an uploaded document image and extract participant information.
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @return array|null The parsed JSON data or null on failure.
     */
    public function scanDocument($file)
    {
        $apiKey = env('GEMINI_API_KEY');
        
        if (empty($apiKey)) {
            Log::error('OCR failed: GEMINI_API_KEY is not set in .env');
            throw new \Exception('API Key Gemini tidak ditemukan. Harap tambahkan GEMINI_API_KEY di pengaturan .env Anda.');
        }

        $base64Image = base64_encode(file_get_contents($file->getRealPath()));
        $mimeType = $file->getMimeType();

        $prompt = "You are an expert OCR system. Read this handwritten document carefully, especially doctor handwriting. Extract the following information and return ONLY a valid JSON object without markdown formatting. Do not include ```json tags.
Fields to extract:
- full_name (Nama Lengkap)
- wa_number (No. WhatsApp, just numbers if possible)
- email (Alamat Email)
- institution (Institusi / Rumah Sakit / Dinas)
- profession (Profesi / Bidang Spesialisasi)

If a field is missing, unreadable, or not present, set its value to an empty string.

Expected JSON format:
{
  \"full_name\": \"...\",
  \"wa_number\": \"...\",
  \"email\": \"...\",
  \"institution\": \"...\",
  \"profession\": \"...\"
}";

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}";

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt],
                        [
                            'inlineData' => [
                                'mimeType' => $mimeType,
                                'data' => $base64Image
                            ]
                        ]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => 0.1, // Low temperature for factual extraction
                'responseMimeType' => 'application/json'
            ]
        ];

        try {
            $response = Http::post($url, $payload);
            
            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                    $jsonString = $data['candidates'][0]['content']['parts'][0]['text'];
                    $parsed = json_decode($jsonString, true);
                    return $parsed;
                }
            }
            
            Log::error('Gemini API Error: ' . $response->body());
            throw new \Exception('Gagal memproses gambar dengan AI. Coba lagi atau periksa gambar Anda.');
            
        } catch (\Exception $e) {
            Log::error('OcrService Error: ' . $e->getMessage());
            throw $e;
        }
    }
}
