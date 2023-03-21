<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    protected $table = 'evaluations';
    protected $fillable = ['id', 'description', 'practice','fk_user_id'];
    protected $hidden = [];

    public function questions(){
        return $this->belongsToMany(Question::class, 'evaluation_questions',
                    'fk_evaluation_id', 'fk_question_id')
        	->as('questions')
            ->withPivot('id')
            ->with('course')
            ->with('questionItems')
            ->with('skill')
            ->with('knowledgeObjects')
            ->with('keywords')
            ->withTimestamps();
    }

    public function applications(){
    	return $this->hasMany(EvaluationApplication::class, 'fk_evaluation_id');
    }

    public function user(){
        return $this->belongsTo(User::class, 'fk_user_id');
    }


}
