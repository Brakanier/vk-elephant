<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pay extends Model
{
    protected $table = 'pays';
    
    public $timestamps = false;
    
    protected $fillable = [
        'pay_id',
        'vk_id',
        'sum',
        'date',
        'anon'
    ];
  
}