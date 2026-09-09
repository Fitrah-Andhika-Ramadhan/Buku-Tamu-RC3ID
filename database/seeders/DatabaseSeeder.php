<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::updateOrCreate(
            ['email' => 'admin@rc3id.unpad.ac.id'],
            [
                'name' => 'Admin RC3ID',
                'password' => bcrypt('RC3IDAdmin2026!'),
            ]
        );
        
        $this->call(SettingSeeder::class);
    }
}
