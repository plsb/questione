<?php

namespace App\Http\Controllers;

use App\AnswersEvaluation;
use App\Course;
use App\Evaluation;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
use App\AnswersHeadEvaluation;
use App\Question;
use App\QuestionHasKnowledgeObject;
use App\QuestionItem;
use App\Skill;
use App\User;
use Illuminate\Http\Request;
use Validator;
use App\Http\Controllers\Controller;

class ResultEvaluationStudent extends Controller
{

    public function __construct()
    {
        $this->middleware(['jwt.auth']);
    }

    public function evaluations(Request $request){
        $user = auth('api')->user();

        $head_answer = AnswersHeadEvaluation::where('fk_user_id',$user->id)
            ->with('evaluationApplication')
            ->orderBy('created_at', 'DESC')
            ->paginate(10);

        if(sizeof($head_answer)==0){
            return response()->json([
                'message' => 'Nenhuma avaliação foi encontrada.',
                $user
            ], 202);
        }

        return response()->json($head_answer, 200);
    }

    public function applicationSpecific($idHead){
        $user = auth('api')->user();

        $head_answer = AnswersHeadEvaluation::where('id',$idHead)
            ->first();
        if(!$head_answer){
            return response()->json([
                'message' => 'Nenhuma avaliação foi encontrada.'
            ], 202);
        }

        if($head_answer->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Aplicação não pertence ao usuário.',
            ], 202);
        }

        $application_evaluation = EvaluationApplication::where('id', $head_answer->fk_application_evaluation_id)->first();
        if($application_evaluation->show_results == 0){
            return response()->json([
                'message' => 'Os resultado não foi liberado.',
            ], 202);
        }

        if($head_answer->finalized_at == null){
            return response()->json([
                'message' => 'A avaliação não foi finalizada pelo estudante.',
            ], 202);
        }

        $resultHeadAnswer = array();

        $answer = AnswersEvaluation::where('fk_answers_head_id', $head_answer->id)->get();
        $resultAnswer = array();
        $qtdCorrect = 0;
        $qtdIncorrect = 0;
        foreach($answer as $as){
            $evaluation_question = EvaluationHasQuestions::where('id', $as->fk_evaluation_question_id)
                ->first();
            $question = Question::where('id', $evaluation_question->fk_question_id)
                ->first();
            $item_correct = QuestionItem::where('fk_question_id', $question->id)
                ->where('correct_item', 1)
                ->first();
            $correct = 0;
            if($item_correct->id == $as->answer){
                $correct = 1;
                $qtdCorrect++;
            } else {
                $qtdIncorrect++;
            }


            $skill = Skill::where('id', $question->fk_skill_id)->first();
            $objects = QuestionHasKnowledgeObject::where('fk_question_id', $question->id)
                ->with('object')
                ->get();

            $auxAnswer= (object)[
                'question' => $question->id,
                'skill' => $skill,
                'objects' => $objects,
                'correct' => $correct,
                'answer' => $as->answer,
            ];
            $resultAnswer[] = $auxAnswer;
        }

        $auxHeadAnswer= (object)[
            'id' => $head_answer->id,
            'qtdCorrect' => $qtdCorrect,
            'qtdIncorrect' => $qtdIncorrect,
            'questions' => $resultAnswer,

        ];

        return response()->json($auxHeadAnswer, 200);
    }


}
