<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'client_id',
        'issue_date',
        'due_date',
        'amount',
        'status' // DRAFT, SENT, PAID, OVERDUE
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
