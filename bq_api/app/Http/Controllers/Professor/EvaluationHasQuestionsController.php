<?php

namespace App\Http\Controllers\Professor;

use App\Course;
use App\Evaluation;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
use App\Question;
use http\Env\Response;
use Illuminate\Http\Request;
use Validator;
use App\Http\Controllers\Controller;

class EvaluationHasQuestionsController extends Controller
{

    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkProfessor']);
    }

    private $rules = [
        'fk_evaluation_id' => 'required',
        'fk_question_id' => 'required',
    ];

    private $messages = [
        'fk_evaluation_id.required' => 'A AVALIAÇÃO é obrigatória.',

        'fk_question_id.required' => 'O QUESTÃO é obrigatória.',

    ];

    public function addQuestion(Request $request){
        //falta verificar se a avaliação não foi aplicada, se já tiver sido, ela não pode ser adicionado itens

        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        $question = Question::find($request->fk_question_id);

        if(!$question){
            return response()->json([
                'message' => 'A questão não foi encontrada.'
            ], 202);
        } else if($question->validated == 0){
            return response()->json([
                'message' => 'A questão não foi validada.'
            ], 202);
        }

        $evaluation = Evaluation::find($request->fk_evaluation_id);

        if(!$evaluation){
            return response()->json([
                'message' => 'A avaliação não foi encontrada.'
            ], 202);
        }

        $user = auth('api')->user();
        if($user->id != $evaluation->fk_user_id){
            return response()->json([
                'message' => 'A avaliação pertence a um outro usuário.'
            ], 202);
        }

        $verifyQuestionStored = EvaluationHasQuestions::where('fk_question_id', "=", $request->fk_question_id)
            ->where('fk_evaluation_id', "=", $request->fk_evaluation_id)->get();

        if(sizeof($verifyQuestionStored)>0){
            return response()->json([
                'message' => 'A questão já foi cadastrada para esta avaliação.'
            ], 202);
        }
        //dd($verifyQuestionStored);

        $evaluation_question = new EvaluationHasQuestions();
        $evaluation_question->fk_question_id = $request->fk_question_id;
        $evaluation_question->fk_evaluation_id = $request->fk_evaluation_id;
        $evaluation_question->save();

        return response()->json([
            'message' => 'Questão adicionada na avaliação.',
            $evaluation_question
        ], 200);

    }

    public function deleteQuestion(Request $request, $id){
        //falta verificar se a avaliação não foi aplicada, se já tiver sido, ela não pode deletar itens
        //return response()->json($request);

        $question = Question::find($id);
        if(!$question){
            return response()->json([
                'message' => 'A questão não foi encontrada.'
            ], 202);
        }

        $evaluation = Evaluation::find($request->fk_evaluation_id);
        //return response()->json($evaluation);
        //dd($evaluation);

        if(!$evaluation){
            return response()->json([
                'message' => 'A avaliação não foi encontrada.'
            ], 202);
        }

        $application = EvaluationApplication::where('fk_evaluation_id', '=', $evaluation->id)->get();
        if(sizeof($application)>0) {
            return response()->json(['message' => 'Existem aplicações para esta avaliação.'], 202);
        }

        $user = auth('api')->user();
        if($user->id != $evaluation->fk_user_id){
            return response()->json([
                'message' => 'A avaliação pertence a um outro usuário.'
            ], 202);
        }

        $question_evaluation = EvaluationHasQuestions::where('fk_question_id', "=", $question->id)
            ->where('fk_evaluation_id', "=", $evaluation->id)->first();
        $question_evaluation->delete();

        return response()->json([
            'message' => 'Questão excluída!'
        ], 200);
    }

    public function cancelOrNot($idEvaluationQuestion){
        $application_question = EvaluationHasQuestions::where('id', $idEvaluationQuestion)
            ->first();

        if(!$application_question){
            return response()->json([
                'message' => 'Questão não encontrada.'
            ], 202);
        }

        $evaluation = Evaluation::where('id', $application_question->fk_evaluation_id)->first();

        $user = auth('api')->user();
        if($user->id != $evaluation->fk_user_id){
            return response()->json([
                'message' => 'A avaliação pertence a um outro usuário.'
            ], 202);
        }

        if($application_question->cancel == 0){
            $application_question->cancel = 1;
        } else {
            $application_question->cancel = 0;
        }
        $application_question->save();

        return response()->json($application_question, 200);

    }


}
