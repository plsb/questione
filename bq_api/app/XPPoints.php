<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class XPPoints extends Model
{
    protected $table = 'table_xppoints';
    protected $fillable = ['id', 'description_id', 'point', 'fk_class_id',
        'fk_answers_head_id', 'fk_answers_id', 'fk_user_id'];
    protected $hidden = [];

    public function configGamification(){
        return $this->hasOne(ClassGamificationSettings::class, 'description_id', 'description_id');
    }
}
