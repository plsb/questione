<?php

namespace App\Http\Controllers;

use App\AnswersEvaluation;
use App\Course;
use App\Evaluation;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
use App\HeadAnswersEvaluation;
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

        //procura o cabeçalho da avaliação
        $head_answer = HeadAnswersEvaluation::where('fk_user_id', $user->id)
            ->where('fk_application_evaluation_id', $application->id)->first();

        if($head_answer){
            //verifica se tem avaliação e já foi finalizada
            if($head_answer->finalized_at != null){
                return response()->json([
                    'message' => 'Avaliação já foi respondida pelo usuário.'
                ], 202);
            }
        } else {
            //senão tem avaliação, então cria nova
            $head_answer = new HeadAnswersEvaluation();
            $head_answer->fk_application_evaluation_id = $application->id;
            $head_answer->fk_user_id = $user->id;
            $head_answer->finalized_at = null;
            $head_answer->save();

        }

        foreach ($questions_evaluations as $question){
            //verifica se já não tem uma resposta inserida
            $verify = AnswersEvaluation::where('fk_answers_head_id', $head_answer->id)
                ->where('fk_evaluation_question_id', $question->id)->get();
            if(sizeof($verify)>0){
                continue;
            }
            //senão tiver, cadastra uma nova com a resposta nula
            $answer = new AnswersEvaluation();
            $answer->answer = null; //answer representa o id da questão
            $answer->fk_evaluation_question_id = $question->id;
            $answer->fk_answers_head_id = $head_answer->id;
            $answer->save();

        }
        //dd($head_answer);
        $return = HeadAnswersEvaluation::where('fk_user_id', $user->id)
            ->where('fk_application_evaluation_id', $application->id)
            ->with('answer')
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

        $answer_head = HeadAnswersEvaluation::where('id', $answer->fk_answers_head_id)->first();
        if(!$answer_head){
            return response()->json([
                'message' => 'Cabeçalho da avaliação não encontrado.'
            ], 202);
        }

        if($answer_head->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Código de resposta não pertence ao usuário logado.'
            ], 202);
        }

        if($answer_head->finalized_at != null){
            return response()->json([
                'message' => 'A avaliação já foi encerrada pelo usuário.'
            ], 202);
        }

        $application_evaluation = EvaluationApplication::where('id',
            $answer_head->fk_application_evaluation_id)->first();
        if($application_evaluation->status == 0){
            return response()->json([
                'message' => 'A aplicação está desativada.'
            ], 202);
        }

        $answer->answer = $request->answer;
        $answer->save();

        return response()->json($answer, 200);
    }

    public function finishEvaluation($idApplication){
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

        $answer_head = HeadAnswersEvaluation::where('fk_user_id', $user->id)
            ->where('fk_application_evaluation_id', $application->id)
            ->first();
        if(!$answer_head){
            return response()->json([
                'message' => 'Cabeçalho da avaliação não encontrado.'
            ], 202);
        }

        if($answer_head->finalized_at != null){
            return response()->json([
                'message' => 'Avaliação já foi finalizada pelo usuário.'
            ], 202);
        }

        //verifica se tem questão que não foi respondida
        $answer = AnswersEvaluation::where('fk_answers_head_id', $answer_head->id)
            ->where('answer', null)
            ->get();
        if(sizeof($answer)>0){
            return response()->json([
                'message' => 'Responda todas as questões.'
            ], 202);
        }
        //dd(date('Y-m-d H:i:s'));
        $answer_head->finalized_at = date('Y-m-d H:i:s');
        $answer_head->save();
        return response()->json([
            'message' => 'Avaliação finalizada.'
        ], 200);

    }

}
