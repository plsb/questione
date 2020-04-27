<?php

namespace App\Http\Controllers\Professor;

use App\Course;
use App\Evaluation;
use App\EvaluationHasQuestions;
use App\Question;
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
            return $validation->errors()->toJson();
        }

        $question = Question::find($request->fk_question_id);

        if(!$question){
            return response()->json([
                'message' => 'Operação não permitida. A questão não foi encontrada.'
            ], 203);
        } else if($question->validated == 0){
            return response()->json([
                'message' => 'Operação não permitida. A questão não foi validada.'
            ], 203);
        }

        $evaluation = Evaluation::find($request->fk_evaluation_id);

        if(!$evaluation){
            return response()->json([
                'message' => 'Operação não permitida. A avaliação não foi encontrada.'
            ], 203);
        }

        $user = auth('api')->user();
        if($user->id != $evaluation->fk_user_id){
            return response()->json([
                'message' => 'Operação não permitida. A avaliação pertence a um outro usuário.'
            ], 203);
        }

        $verifyQuestionStored = EvaluationHasQuestions::where('fk_question_id', "=", $request->fk_question_id)
            ->where('fk_evaluation_id', "=", $request->fk_evaluation_id)->get();
        if(sizeof($verifyQuestionStored)>0){
            return response()->json([
                'message' => 'Operação não permitida. A questão já foi cadastrada para esta avaliação.'
            ], 203);
        }

        $evaluation_question = new EvaluationHasQuestions();
        $evaluation_question->fk_question_id = $request->fk_question_id;
        $evaluation_question->fk_evaluation_id = $request->fk_evaluation_id;
        $evaluation_question->save();

        return response()->json($evaluation_question);

    }

    public function deleteQuestion(Request $request){
        //falta verificar se a avaliação não foi aplicada, se já tiver sido, ela não pode deletar itens
        //return response()->json($request);
        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            return $validation->errors()->toJson();
        }

        $question = Question::find($request->fk_question_id);
        if(!$question){
            return response()->json([
                'message' => 'Operação não permitida. A questão não foi encontrada.'
            ], 203);
        }

        $evaluation = Evaluation::find($request->fk_evaluation_id);
        //return response()->json($evaluation);

        if(!$evaluation){
            return response()->json([
                'message' => 'Operação não permitida. A avaliação não foi encontrada.'
            ], 203);
        }

        $user = auth('api')->user();
        if($user->id != $evaluation->fk_user_id){
            return response()->json([
                'message' => 'Operação não permitida. A avaliação pertence a um outro usuário.'
            ], 203);
        }

        $verifyQuestionStored = EvaluationHasQuestions::where('fk_question_id', "=", $request->fk_question_id)
            ->where('fk_evaluation_id', "=", $request->fk_evaluation_id)->get();
        foreach ($verifyQuestionStored as $value) {
            $value->delete();
        }

        return response()->json([
            'message' => 'Questão excluída!'
        ], 202);
    }


}
