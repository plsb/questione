<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EvaluationApplication extends Model
{
    protected $table = 'evaluation_application';
    protected $fillable = ['id', 'id_application', 'description','fk_evaluation_id', 'status',
        'random_questions', 'show_results', 'date_start', 'time_start', 'time_to_finalize',
        'date_finish', 'time_finish', 'date_release_results', 'time_release_results',
        'public_results', 'can_see_students',
        'release_preview_question','created_at', 'fk_class_id'];
    protected $hidden = [];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    protected $appends = ['canShowResults'];

    public function getCanShowResultsAttribute(){
        if($this->show_results == 1){
            if($this->date_release_results != null){
                if($this->date_release_results == date('Y-m-d')){ //verifica se a data de liberar os resultados é igual a data atual
                    if($this->time_release_results <= date('H:i:s')){ //verifica se a hora de liberar os resultados é maior que a hora atual
                        return 1;
                    }
                } else if($this->date_release_results < date('Y-m-d')) {
                    return 1;
                }
                return 0;
            }
            return 1;
        }
        return 0;
    }

    public function evaluation(){
        return $this->belongsTo(Evaluation::class, 'fk_evaluation_id')
            ->with('user');
            //->with('questions');
    }

    public function evaluationWithQuestions(){
        return $this->belongsTo(Evaluation::class, 'fk_evaluation_id')
            ->with('user')
            ->with('questions');
    }

    public function headAnswer(){
        return $this->hasOne(AnswersHeadEvaluation::class,
            'fk_application_evaluation_id');
    }

    public function class(){
        return $this->belongsTo(ClassQuestione::class, 'fk_class_id');
    }
}
