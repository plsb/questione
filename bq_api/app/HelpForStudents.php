<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class HelpForStudents extends Model
{
    /*
     * Description_id
     * Apagar uma alternativa errada = help_delete_one_wrong_alternative
     * Apagar duas alternativas erradas = help_delete_two_wrong_alternatives
     * Apagar três alternativas erradas = help_delete_three_wrong_alternatives
     * Ajuda dos universitários = help_from_university_students
     */

    protected $table = 'help_for_students';
    protected $fillable = [
    		'id',
    		'description_id',
    		'fk_anwers_id',
    		'fk_answer_deleted_id'];

    protected $hidden = [];

    protected $appends = ['totalAnswersByItemQuestion'];

    public function getTotalAnswersByItemQuestionAttribute(){
        if($this->fk_anwers_id && $this->description_id == 'help_from_university_students'){
            $answer = AnswersEvaluation::where('id', $this->fk_anwers_id)
                ->with('evaluationQuestion')
                ->first();
            $items_question = $answer->evaluationQuestion->question->questionItemsWithoutCorrect;

            $array_items = array();
            $total_general_anwers = 0;
            foreach ($items_question as $item){
                $total = AnswersEvaluation::where('answer', $item->id)
                    ->count();
                $result = (object)[
                    'id' => $item->id,
                    'total_answers' => $total,
                ];
                $total_general_anwers += $total;
                $array_items[] = $result;
            }

            $result = (object)[
                'items' => $array_items,
                'total_answers' => $total_general_anwers,
            ];
            return $result;
        }
        return null;
    }

    public function gamificationSettings(){
        return $this->hasMany(ClassGamificationSettings::class, 'description_id', 'description_id');
    }

}
