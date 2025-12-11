<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'industry',
        'address',
        'status', // ACTIVE, INACTIVE
        'avatar',
        'total_spent'
    ];

    public function deals()
    {
        return $this->hasMany(Deal::class);
    }
}
