<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClassBadgesStudent extends Model
{
    protected $table = 'gamification_badges_students';
    protected $fillable = ['id', 'description_id', 'fk_class_id', 'fk_user_id', 'fk_evaluation_aplication_id'];
    protected $hidden = [];

    public function classQuestione(){
        return $this->belongsTo(ClassQuestione::class, 'fk_class_id');
    }

    public function badgesSettings(){
        return $this->belongsTo(ClassBadgesSettings::class, 'description_id','description_id');
    }

}
