<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deal extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'value',
        'currency',
        'stage', // PROSPECTING, NEGOTIATION, CLOSED_WON, CLOSED_LOST
        'probability',
        'client_id',
        'assigned_to',
        'expected_close_date'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
