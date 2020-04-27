<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EvaluationHasQuestions extends Model
{
    protected $table = 'evaluation_questions';
    protected $fillable = ['id', 'fk_evaluation_id', 'fk_question_id'];
    protected $hidden = [];
}
