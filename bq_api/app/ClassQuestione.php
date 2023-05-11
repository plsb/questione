<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClassQuestione extends Model
{
    protected $table = 'class';
    protected $fillable = ['id', 'id_class', 'description', 'status', 'fk_user_id',
        'fk_course_id', 'gamified_class'];
    protected $hidden = [];

    public function user(){
        return $this->belongsTo(User::class, 'fk_user_id');
    }

    public function course(){
        return $this->belongsTo(Course::class, 'fk_course_id');
    }
}
