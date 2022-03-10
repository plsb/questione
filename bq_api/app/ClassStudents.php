<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClassStudents extends Model
{
    protected $table = 'class_students';
    protected $fillable = ['id', 'active', 'fk_class_id', 'fk_user_id'];
    protected $hidden = [];

    public function user(){
        return $this->belongsTo(User::class, 'fk_user_id');
    }

    public function classQuestione(){
        return $this->belongsTo(ClassQuestione::class, 'fk_class_id');
    }
}
