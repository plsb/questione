<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Regulation extends Model
{
    protected $table = 'regulation';
    protected $fillable = ['id', 'description', 'year','fk_course_id'];
    protected $hidden = [];

    public function course(){
        return $this->belongsTo(Course::class, 'fk_course_id');
    }


}
