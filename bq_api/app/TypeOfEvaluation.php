<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TypeOfEvaluation extends Model
{
    protected $table = 'type_of_evaluations';
    protected $fillable = ['id', 'description'];
    protected $hidden = [];
}
