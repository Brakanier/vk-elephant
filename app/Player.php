<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    protected $table = 'players';
    
    public $timestamps = false;
    
    protected $fillable = [
        'vk_id'
    ];
}
