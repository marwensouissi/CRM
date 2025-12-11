<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject',
        'description',
        'status', // OPEN, IN_PROGRESS, RESOLVED, CLOSED
        'priority', // LOW, MEDIUM, HIGH, URGENT
        'client_id',
        'assigned_to'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
