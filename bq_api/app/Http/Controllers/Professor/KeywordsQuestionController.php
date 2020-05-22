<?php

namespace App\Http\Controllers\Professor;

use App\Course;
use App\CourseProfessor;
use App\EvaluationHasQuestions;
use App\KeywordQuestion;
use App\KnowledgeObject;
use App\Profile;
use App\Question;
use App\QuestionHasKnowledgeObject;
use App\QuestionItem;
use App\RankQuestion;
use App\Skill;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;

class KeywordsQuestionController extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkProfessor']);
    }

    private $rules = [
        'keyword' => 'required',
        'fk_question_id' => 'required',

    ];

    private $messages = [
        'keyword.required' => 'A palavra-chave é obrigatória.',
        'fk_question_id.required' => 'A questão é obrigatório.',

    ];

    public function index($idQuestion)
    {
        $user = auth('api')->user();
        $question = Question::find($idQuestion);

        if(!$question){
            return response()->json([
                'message' => 'Questão não encontrada.'
            ], 202);
        }

        if($question->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Acesso não permitido para esta questão.'
            ], 202);
        }

        $keyword = KeywordQuestion::where('fk_question_id', $question->id)
            ->orderBy('keyword')
            ->get();

        return response()->json($keyword, 200);

    }

    public function store(Request $request)
    {
        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        $user = auth('api')->user();
        $question = Question::find($request->fk_question_id);

        if(!$question){
            return response()->json([
                'message' => 'Questão não encontrada.'
            ], 202);
        }

        if($question->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Acesso não permitido para esta questão.'
            ], 202);
        }

        $verify = KeywordQuestion::where('fk_question_id', $request->fk_question_id)
            ->where('keyword', $request->keyword)
            ->get();
        if(sizeof($verify)>0){
            return response()->json([
                'message' => 'Palavra-chave já cadastrada para esta questão.'
            ], 202);
        }

        $keyword = new KeywordQuestion();
        $keyword->fk_question_id = $request->fk_question_id;
        $keyword->keyword = $request->keyword;
        $keyword->save();

        return response()->json([
            'message' => 'Palavra-chave '.$keyword->keyword.' cadastrada.',
            $keyword
        ], 200);
    }

    public function delete(Request $request, $id)
    {
        if(!$request->fk_question_id){
            return response()->json([
                'message' => 'Informe a questão'
            ], 202);
        }

        $user = auth('api')->user();
        $question = Question::find($request->fk_question_id);

        if(!$question){
            return response()->json([
                'message' => 'Questão não encontrada.'
            ], 202);
        }

        if($question->fk_user_id != $user->id){
            return response()->json([
                'message' => 'A questão pertence a outro usuário.'
            ], 202);
        }

        $keyword = KeywordQuestion::where('id',$id)->first();

        if(!$keyword){
            return response()->json([
                'message' => 'Palavra-chave não encontrada.'
            ], 202);
        }

        if($keyword->fk_question_id != $question->id){
            return response()->json([
                'message' => 'Palavra-chave não pertence a questão selecionada.'
            ], 202);
        }

        $keyword->delete();

        return response()->json([
            'Palavra-chave deletada.'
        ], 200);
    }



}
