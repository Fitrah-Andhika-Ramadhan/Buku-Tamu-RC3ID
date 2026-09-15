<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_id', 'content_html', 'ai_summary'
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }
}
