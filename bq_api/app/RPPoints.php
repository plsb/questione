<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RPPoints extends Model
{
    /*
     * Type: C - credit | D - debit
     */
    protected $table = 'gamification_rppoints';
    protected $fillable = ['id', 'description_id', 'point', 'type', 'fk_class_id',
        'fk_answers_head_id', 'fk_answers_id', 'fk_user_id'];
    protected $hidden = [];

    public function configGamification(){
        return $this->hasOne(ClassGamificationSettings::class, 'description_id', 'description_id');
    }
}
