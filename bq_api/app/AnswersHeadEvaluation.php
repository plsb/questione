<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AnswersHeadEvaluation extends Model
{
    protected $table = 'answers_head';
    protected $fillable = [
    		'id',
            'fk_application_evaluation_id',
    		'fk_user_id',
    		'finalized_at',
    		'created_at'];

    protected $hidden = [];

    public function user(){
        return $this->belongsTo(User::class, 'fk_user_id');
    }

    public function evaluationApplication(){
        return $this->belongsTo(EvaluationApplication::class, 'fk_application_evaluation_id')
            ->with('evaluation')
            ->with('class');
    }

    public function evaluationApplicationWithQuestions(){
        return $this->belongsTo(EvaluationApplication::class, 'fk_application_evaluation_id')
            ->with('evaluationWithQuestions');
    }

    public function answer(){
        return $this->hasMany(AnswersEvaluation::class, 'fk_answers_head_id')
            ->with('evaluationQuestion');
    }


}
