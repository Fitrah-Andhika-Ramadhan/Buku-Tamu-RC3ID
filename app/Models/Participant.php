<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Participant extends Model
{
    use HasUuids;

    protected $fillable = [
        'full_name',
        'wa_number',
        'email',
        'institution',
        'profession',
        'collaboration',
        'is_attending',
        'social_media',
        'custom_responses',
    ];

    protected $casts = [
        'is_attending' => 'boolean',
        'custom_responses' => 'array',
    ];
}
