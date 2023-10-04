<?php

namespace App\Http\Controllers\Gamification;

use App\AnswersEvaluation;
use App\AnswersHeadEvaluation;
use App\ClassGamificationSettings;
use App\ClassQuestione;
use App\ClassStudents;
use App\HelpForStudents;
use App\Http\Controllers\Controller;
use App\Question;
use App\QuestionItem;
use App\RPPoints;
use App\XPPoints;
use Illuminate\Http\Request;
use Validator;

class HelpForStudentsController extends Controller
{

    private function verifyParameters($id_answer, $user, $description_id){

        $answer = AnswersEvaluation::where('id', $id_answer)
            ->with('evaluationQuestion')
            ->first();

        if(!$answer){
            $result = (object)[
                'message' => 'Resposta do simulado não encontrado.',
                'answer' => null,
                'answer_head' => null,
                'id_class' => null,
                'gamification_class_settings' => null,
            ];
            return $result;
        }

        $helpStudents_verify = HelpForStudents::where('fk_anwers_id', $answer->id)->first();
        if($helpStudents_verify){
            $result = (object)[
                'message' => 'O estudante já utilizou uma ajuda para esta questão.',
                'answer' => null,
                'answer_head' => null,
                'id_class' => null,
                'gamification_class_settings' => null,
            ];
            return $result;
        }

        $answers_head = AnswersHeadEvaluation::where('fk_user_id', $user->id)
            ->where('id', $answer->fk_answers_head_id)
            ->with('evaluationApplication')
            ->first();

        if(!$answers_head){
            $result = (object)[
                'message' => 'Resposta do simulado não encontrado.',
                'answer' => null,
                'answer_head' => null,
                'id_class' => null,
                'gamification_class_settings' => null,
            ];
            return $result;
        }

        if($answers_head->evaluationApplication->class->gamified_class != 1){
            $result = (object)[
                'message' => 'A turma não é gamificada.',
                'answer' => null,
                'answer_head' => null,
                'id_class' => null,
                'gamification_class_settings' => null,
            ];
            return $result;
        }

        $id_class = $answers_head->evaluationApplication->class->id;

        $gamification_class_settings = ClassGamificationSettings::where('description_id', $description_id)
            ->where('fk_class_id', $id_class)->first();

        if(!$gamification_class_settings){
            $result = (object)[
                'message' => 'Ajuda não encontrada',
                'answer' => null,
                'answer_head' => null,
                'id_class' => null,
                'gamification_class_settings' => null,
            ];
            return $result;
        }

        //verifica se o estudante tem pontos suficientes
        $gamificationController = new ClassGamificationStudentController();
        if(!$gamificationController->checkIfHaveEnoughRP($id_class, $gamification_class_settings->RP)){
            $result = (object)[
                'message' => 'Não foi possível. '.$gamificationController->messageForInsufficientRPStock(),
                'answer' => null,
                'answer_head' => null,
                'id_class' => null,
                'gamification_class_settings' => null,
            ];
            return $result;
        }

        $result = (object)[
            'message' => null,
            'answer' => $answer,
            'answer_head' => $answers_head,
            'id_class' => $id_class,
            'gamification_class_settings' => $gamification_class_settings,
        ];

        return $result;

    }

    public function helpFromUniversityStudents(Request $request, $id_answer){
        $user = auth('api')->user();

        $description_id = 'help_from_university_students';

        $return = $this->verifyParameters($id_answer, $user, $description_id);

        if($return->message !=null){
             return response()->json([
                 'message' => $return->message
             ], 202);
        }

        $answer = $return->answer;
        $answers_head = $return->answer_head;
        $id_class = $return->id_class;

        $this->saveHelp($description_id, $answer->id);
        $this->takesPointsFromRP($description_id, $id_class, $answers_head->id, $answer->id);

        $helpStudents_verify = $this->listHelForStudents($description_id, $answer->id);

        return response()->json($helpStudents_verify, 200);

    }

    public function removeAlternative(Request $request, $id_answer){
        $user = auth('api')->user();

        if(!$request->total_items_to_remove){
            return response()->json([
                'message' => 'Informe quantos items quer apagar.'
            ], 202);
        }
        $total_items_to_remove = $request->total_items_to_remove;

        $description_id = '';
        switch ($total_items_to_remove) {
            case 1:
                $description_id = 'help_delete_one_wrong_alternative';
                break;
            case 2:
                $description_id = 'help_delete_two_wrong_alternatives';
                break;
            case 3:
                $description_id = 'help_delete_three_wrong_alternatives';
                break;
        }

        $return = $this->verifyParameters($id_answer, $user, $description_id);

        if($return->message !=null){
            return response()->json([
                'message' => $return->message
            ], 202);
        }

        $answer = $return->answer;
        $answers_head = $return->answer_head;
        $id_class = $return->id_class;

        if(!((sizeof($answer->evaluationQuestion->question->questionItems) - $total_items_to_remove) >= 2)){
            return response()->json([
                'message' => 'Questão não tem itens suficientes.'
            ], 202);
        }

        $arrayQuestionsItensToRemove = $this->candidateItemsToRemove($answer);

        $array_position_item_removed = array();
        if($total_items_to_remove == 1){
            $array_position_item_removed[] = array_rand($arrayQuestionsItensToRemove, $total_items_to_remove);
        } else {
            $array_position_item_removed = array_rand($arrayQuestionsItensToRemove, $total_items_to_remove);
        }

        foreach ($array_position_item_removed as $position_item_removed){
            $item_chosen_to_remove = $arrayQuestionsItensToRemove[$position_item_removed];

            $this->saveHelp($description_id, $answer->id, $item_chosen_to_remove);

        }
        $this->takesPointsFromRP($description_id, $id_class, $answers_head->id, $answer->id);

        $helpStudents_verify = $this->listHelForStudents($description_id, $answer->id);

        return response()->json($helpStudents_verify, 200);

    }

    private function candidateItemsToRemove($answer){
        $questionsItens = $answer->evaluationQuestion->question->questionItems;
        $arrayQuestionsItensToRemove = array();
        foreach ($questionsItens as $item){
            if($item->id == $answer->answer || $item->correct_item == 1){
                continue ;
            }
            $arrayQuestionsItensToRemove[] = $item->id;
        }
        return $arrayQuestionsItensToRemove;
    }

    private function saveHelp($description_id, $answer_id, $item_chosen_to_remove = null){
        $helpStudents = new HelpForStudents();
        $helpStudents->description_id = $description_id;
        $helpStudents->fk_anwers_id = $answer_id;
        $helpStudents->fk_answer_deleted_id = $item_chosen_to_remove;
        $helpStudents->save();
    }

    private function takesPointsFromRP ($description_id, $id_class, $answers_head_id, $answer_id ){
        //tira pontuação dos PRs
        $pointSystem = new PointSystemController();
        $pointSystem->RPpoint($description_id, $id_class,
            $answers_head_id, $answer_id, null, 'D');
    }

    private function listHelForStudents($description_id, $answer_id){
        return HelpForStudents::where('description_id', $description_id)
            ->where('fk_anwers_id', $answer_id)
            ->with('gamificationSettings')
            ->get();
    }

}
