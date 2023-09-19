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

    public function gamification(){
        return $this->hasMany(ClassGamificationSettings::class, 'fk_class_id');
    }

    public function class_student(){
        $user = auth('api')->user();
        return $this->hasMany(ClassStudents::class, 'fk_class_id')
            ->where('fk_user_id', $user->id);
    }

    public function class_student_all(){
        return $this->hasMany(ClassStudents::class, 'fk_class_id');
    }


}
