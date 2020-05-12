<?php

namespace App\Http\Controllers\Professor;

use App\Evaluation;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
use App\Question;
use App\RankQuestion;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;
use DB;

class RankQuestionController extends Controller
{
    /*
     * Status 1 - Ativa
     * Status 2 - Arquivada
     */
    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkProfessor']);
    }

    private $rules = [
        'rank' => 'required',
        'fk_question_id' => 'required',
    ];

    private $messages = [
        'rank.required' => 'A CLASSIFICAÇÃO é obrigatória.',
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

        if($request->rank > 5 || $request->rank < 1){
            return response()->json([
                'message' => 'A classificação deve ser maior que 1 e menor que 5.'
            ], 202);
        }

        $user = auth('api')->user();

        $question = Question::where('id', $request->fk_question_id)->first();
        if(!$question){
            return response()->json([
                'message' => 'Questão não encontrada.'
            ], 202);
        }
        if($question->fk_user_id == $user->id){
            return response()->json([
                'message' => 'O usuário não pode classificar sua própria questão.'
            ], 202);
        }

        $rank = RankQuestion::where('fk_question_id', $request->fk_question_id)
            ->where('fk_user_id',$user->id)->first();
        if(!$rank){
            $rank = new RankQuestion();
        }

        $rank->rank = $request->rank;
        $rank->fk_user_id = $user->id;
        $rank->fk_question_id = $request->fk_question_id;
        $rank->save();

        return response()->json([
            'message' => 'Classificação cadastrada.',
            $rank
        ], 200);
    }

    public function rankByUser(Request $request)
    {

        if(!$request->fk_question_id){
            return response()->json([
                'message' => 'Informe a questão.'
            ], 202);
        }

        $user = auth('api')->user();
        //dd($user->id);
        $rank = RankQuestion::where('fk_user_id', $user->id)
            ->where('fk_question_id', $request->fk_question_id)->first();

        $rank_value = 0;
        if($rank){
            $rank_value = $rank->rank;
        }

        return response()->json($rank, 200);
    }

    public function rankByQuestion(Request $request)
    {
        if(!$request->fk_question_id){
            return response()->json([
                'message' => 'Informe a questão.'
            ], 202);
        }

        $rank = RankQuestion::where('fk_question_id', $request->fk_question_id)->avg('rank');
        $rank_count = RankQuestion::where('fk_question_id', $request->fk_question_id)->count();

        $rank_avg = 0;
        if($rank){
            $rank_avg = $rank;
        }
        $result = array();
        $aux= (object)[
            'count' => $rank_count,
            'avg' => round($rank_avg),
        ];
        $result[] = $aux;

        return response()->json($result, 200);
    }





}
