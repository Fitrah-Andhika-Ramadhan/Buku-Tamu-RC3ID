<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Default Form Fields (Profesi, Kolaborasi, Sosmed)
        $defaultFields = [
            [
                'id' => '1700000000001',
                'type' => 'text',
                'label' => 'Profesi / Bidang Spesialisasi',
                'name' => 'profesi',
                'required' => true,
            ],
            [
                'id' => '1700000000002',
                'type' => 'radio',
                'label' => 'Peluang Kolaborasi',
                'name' => 'kolaborasi',
                'required' => true,
                'options' => [
                    'Ingin faskes kami menjadi mitra uji teknologI kesehatan baru (TB/Dengue/HIV)',
                    'Tertarik informasi program doktoral (S3) / kolaborasi penulisan riset',
                    'Tertarik memanfaatkan fasilitas laboratorium dan data science di RC3ID',
                    'Tertarik mengadopsi modul/SOP deteksi dini di faskes kami',
                    'Hanya ingin mendapatkan pembaruan buletin riset berkala (newsletter/WA community)'
                ]
            ],
            [
                'id' => '1700000000003',
                'type' => 'radio',
                'label' => 'Pastikan anda mengikuti sosial media RC3ID untuk mendapatkan merchandise gratis:',
                'name' => 'sosmed',
                'required' => true,
                'options' => [
                    'Sudah dong!',
                    'Belum nih'
                ]
            ]
        ];

        Setting::firstOrCreate(
            ['key' => 'guestbook_form_fields'],
            ['value' => $defaultFields]
        );

        // 2. Default Success Page Config
        $defaultSuccessConfig = [
            'success_message' => 'Silakan tunjukkan layar ini atau berikan nama Anda kepada staf kami untuk verifikasi kehadiran dan klaim merchandise eksklusif.',
            'e_materi_url' => '#',
            'show_merchandise' => true,
        ];

        Setting::firstOrCreate(
            ['key' => 'success_page_config'],
            ['value' => $defaultSuccessConfig]
        );
    }
}
