<?php

namespace App\Http\Controllers;

use App\AnswersEvaluation;
use App\Course;
use App\Evaluation;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
use App\Question;
use Illuminate\Http\Request;
use Validator;
use App\Http\Controllers\Controller;

class DoEvaluation extends Controller
{

    public function __construct()
    {
        $this->middleware(['jwt.auth']);
    }

    public function getApplication($id){

        $evaluation_application = EvaluationApplication::where('id_application', $id)
            ->with('evaluation')
            ->first();
        if($evaluation_application){
            return response()->json($evaluation_application, 200);
        } else {
            return response()->json($evaluation_application, 202);
        }
    }

    public function startEvaluation($idApplication){
        $user = auth('api')->user();

        $application = EvaluationApplication::where('id_application', $idApplication)->first();

        if(!$application){
            return response()->json([
                'message' => 'Aplicação não encontrada.'
            ], 202);
        }

        if($application->status==0){
            return response()->json([
                'message' => 'Aplicação está desabilitada.'
            ], 202);
        }

        $questions_evaluations = EvaluationHasQuestions::where('fk_evaluation_id', $application->fk_evaluation_id)->get();

        if(sizeof($questions_evaluations)==0){
            return response()->json([
                'message' => 'Avaliação não possui questões.'
            ], 202);
        }

        foreach ($questions_evaluations as $question){
            //verifica se já não tem uma resposta inserida
            $verify = AnswersEvaluation::where('fk_user_id', $user->id)
                ->where('fk_evaluation_question_id', $question->id)
                ->where('fk_aplication_evaluation_id', $application->id)->get();
            if(sizeof($verify)>0){
                continue;
            }
            //senão tiver, cadastra uma nova com a resposta nula
            $answer = new AnswersEvaluation();
            $answer->answer = null; //answer representa o id da questão
            $answer->fk_evaluation_question_id = $question->id;
            $answer->fk_user_id = $user->id;
            $answer->fk_aplication_evaluation_id = $application->id;
            $answer->save();

        }
        $return = AnswersEvaluation::where('fk_user_id', $user->id)
            ->where('fk_aplication_evaluation_id', $application->id)
            ->with('evaluationQuestion')
            ->with('evaluationApplication')
            ->with('user')
            ->get();

        return response()->json($return, 200);
    }

    public function answer(Request $request, $id_application){

        $user = auth('api')->user();

        if(!$request->id){
            return response()->json([
                'message' => 'Informe o código da resposta.'
            ], 202);
        }

        if(!$request->answer){
            return response()->json([
                'message' => 'Informe a resposta.'
            ], 202);
        }

        $answer = AnswersEvaluation::where('id', $request->id)->first();

        if(!$answer){
            return response()->json([
                'message' => 'Código de resposta não encontrado.'
            ], 202);
        }

        if($answer->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Código de resposta não pertence ao usuário logado.'
            ], 202);
        }

        $application_evaluation = EvaluationApplication::where('id',
                            $answer->fk_aplication_evaluation_id)->first();
        if($application_evaluation->status == 0){
            return response()->json([
                'message' => 'A aplicação está desativada.'
            ], 202);
        }

        $answer->answer = $request->answer;
        $answer->save();

        return response()->json($answer, 200);
    }

}
