<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CourseProfessor extends Model
{
    protected $table = 'course_professor';
    protected $fillable = ['id', 'fk_user_id', 'fk_course_id', 'receipt', 'valid', 'created_at'];
    protected $hidden = [];

    public function user(){
        return $this->belongsTo(User::class, 'fk_user_id');
    }

    public function course(){
        return $this->belongsTo(Course::class, 'fk_course_id');
    }
}
