<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DifficultyQuestion extends Model
{
    protected $table = 'difficulty';
    protected $fillable = ['id', 'difficulty', 'fk_question_id', 'fk_user_id'];
    protected $hidden = [];

    public function user(){
    	return $this->belongsTo(User::class, 'fk_user_id');
    }

    public function question(){
        return $this->belongsTo(Question::class, 'fk_question_id');
    }
}
