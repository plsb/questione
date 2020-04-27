<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $table = 'skills';
    protected $fillable = ['id', 'description', 'fk_course_id'];
    protected $hidden = [];

    public function course(){
        return $this->belongsTo(Course::class, 'fk_course_id');
    }
}
