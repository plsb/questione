<?php

namespace App\Http\Controllers;

use App\DifficultyQuestion;
use App\Question;
use Illuminate\Http\Request;
use Validator;
use DB;

class DifficultQuestionController extends Controller
{
    /*
     * Status 1 - Fácil
     * Status 2 - Média
     * Status 3 - Difícil
     */
    public function __construct()
    {
        $this->middleware(['jwt.auth']);
    }

    private $rules = [
        'difficulty' => 'required',
        'fk_question_id' => 'required',
    ];

    private $messages = [
        'difficulty.required' => 'A DIFICULDADE é obrigatória.',
        'fk_question_id.required' => 'A QUESTÃO é obrigatória.',

    ];

    public function storeUpdate(Request $request)
    {
        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        if($request->difficulty > 3 || $request->difficulty < 1){
            return response()->json([
                'message' => 'A dificuldade deve está entre 1 e 3.'
            ], 202);
        }

        $user = auth('api')->user();

        $question = Question::where('id', $request->fk_question_id)->first();
        if(!$question){
            return response()->json([
                'message' => 'Questão não encontrada.'
            ], 202);
        }

        $difficulty = DifficultyQuestion::where('fk_question_id', $request->fk_question_id)
            ->where('fk_user_id',$user->id)->first();
        if(!$difficulty){
            $difficulty = new DifficultyQuestion();
        }

        $difficulty->difficulty = $request->difficulty;
        $difficulty->fk_user_id = $user->id;
        $difficulty->fk_question_id = $request->fk_question_id;
        $difficulty->save();

        return response()->json([
            'message' => 'Dificuldade cadastrada.',
            $difficulty
        ], 200);
    }

}
