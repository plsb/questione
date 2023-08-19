<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClassBadgesStudent extends Model
{
    protected $table = 'gamification_badges_students';
    protected $fillable = ['id', 'description_id', 'fk_class_id', 'fk_user_id'];
    protected $hidden = [];

    public function classQuestione(){
        return $this->belongsTo(ClassQuestione::class, 'fk_class_id');
    }

}
