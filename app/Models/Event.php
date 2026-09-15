<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Event extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'slug',
        'form_fields',
        'form_header',
        'success_config',
        'landing_config',
        'is_active',
    ];

    protected $casts = [
        'form_fields' => 'array',
        'form_header' => 'array',
        'success_config' => 'array',
        'landing_config' => 'array',
        'is_active' => 'boolean',
    ];

    public function participants()
    {
        return $this->hasMany(Participant::class);
    }
}
