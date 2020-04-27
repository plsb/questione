<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $table = 'profiles';
    protected $fillable = ['id', 'description', 'fk_course_id'];
    protected $hidden = [];

    public function course(){
    	return $this->belongsTo(Course::class, 'fk_course_id');
    }
}
