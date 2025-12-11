<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'status', // NEW, CONTACTED, QUALIFIED, LOST, WON
        'source', // WEBSITE, REFERRAL, etc.
        'value',
        'assigned_to',
        'notes'
    ];

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function notes()
    {
        return $this->morphMany(Note::class, 'noteable');
    }
}
