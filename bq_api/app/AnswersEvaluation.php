<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AnswersEvaluation extends Model
{
    protected $table = 'answers';
    protected $fillable = [
    		'id',
    		'answer',
    		'fk_evaluation_question_id',
    		'fk_aplication_evaluation_id', //nova versão não vai mais precisar desse campo, será mantido para ter compatiibilidade com avaliações anteriores
            'fk_answers_head_id'];

    protected $hidden = [];

    public function evaluationQuestion(){
        return $this->belongsTo(EvaluationHasQuestions::class, 'fk_evaluation_question_id')
            ->with('question');
    }

    public function evaluationApplication(){
        return $this->belongsTo(EvaluationApplication::class, 'fk_aplication_evaluation_id');
    }

    public function user(){
        return $this->belongsTo(User::class, 'fk_user_id');
    }
}
