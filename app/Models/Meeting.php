<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'event_id',
        'title',
        'room_slug',
        'host_id',
        'is_active',
        'zoom_meeting_id',
        'zoom_join_url',
        'zoom_start_url'
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function host()
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function notes()
    {
        return $this->hasOne(MeetingNote::class);
    }
}
