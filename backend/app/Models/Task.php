<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'due_date',
        'priority', // LOW, MEDIUM, HIGH
        'status', // TODO, IN_PROGRESS, DONE
        'assigned_to',
        'related_to_type', // polymorphic: App\Models\Client or Lead
        'related_to_id'
    ];

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
