<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LogStudenAssessment extends Model
{
    /*
     * Type = I (input) | O (output)
     */
    protected $table = 'log_student_assessment';
    protected $fillable = ['id', 'type', 'fk_anwers_head_id'];
    protected $hidden = [];

    public function answersHead(){
        return $this->belongsTo(AnswersHeadEvaluation::class, 'fk_answers_head_id')
            ->with('user');
    }
}
