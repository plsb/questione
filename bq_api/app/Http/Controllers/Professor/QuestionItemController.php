<?php

namespace App\Http\Controllers\Professor;

use App\Question;
use App\QuestionItem;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;

class QuestionItemController extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkProfessor']);
    }

    private $rules = [
        'description' => 'required',
        'fk_question_id' => 'required',
    ];

    private $messages = [
        'description.required' => 'A DESCRIÇÃO é obrigatória.',

        'fk_question_id.required' => 'A QUESTÃO é obrigatório.',

    ];

    public function index(Request $request)
    {
        if(!$request->fk_question_id)
        {
            return response()->json([
                'message' => 'Informe a Questão.'
            ], 202);
        }
        $question_items = QuestionItem::where('fk_question_id', '=', $request->fk_question_id)->orderBy('id')->get();
        return response()->json($question_items, 200);
    }

    public function store(Request $request)
    {
        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            return $validation->errors()->toJson();
        }

        $question = Question::find($request->fk_question_id);
        if(!$question){
            return response()->json([
                'message' => 'A Questão não foi encontrada.'
            ], 202);
        }

        $user = auth('api')->user();

        if($question->validated == 1){
            return response()->json([
                'message' => 'A Questão já foi validada.'
            ], 202);
        }

        if($question->fk_user_id != $user->id){
            return response()->json([
                'message' => 'A Questão não pertence ao usuário logado.'
            ], 202);
        }

        $count_items_stored = QuestionItem::where('fk_question_id', '=', $request->fk_question_id)->count();
        if($count_items_stored >= 5){
            return response()->json([
                'message' => 'A Questão já possui 05 itens de resposta.'
            ], 202);
        }

        $question_item = new QuestionItem();
        $question_item->description = $request->description;
        $question_item->correct_item = $request->correct_item;
        $question_item->fk_question_id = $request->fk_question_id;
        $request->correct_item ?
                $question_item->correct_item = $request->correct_item : $question_item->correct_item = 0;
        $question_item->save();

        return response()->json($question_item, 201);
    }

    public function update(Request $request, $id)
    {
        if(!$request->description){
            return response()->json([
                'message' => 'A DESCRIÇÃO é obrigatória.'
            ], 202);
        }

        $question_item = QuestionItem::find($id);

        if(!$question_item){
            return response()->json([
                'message' => 'Operação não realizada. Item de questão não encontrado.'
            ], 202);
        }

        $question = Question::find($question_item->fk_question_id);
        $user = auth('api')->user();

        if($question->validated == 1){
            return response()->json([
                'message' => 'Operação não realizada. A Questão já foi validada.'
            ], 202);
        }

        if($question->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Operação não realizada. A Questão não pertence ao usuário logado.'
            ], 202);
        }

        $this->verifyRecord($question_item);
        $correct_item = $question_item->correct_item;
        if($request->correct_item) {
            $correct_item = $request->correct_item;
        }
        //return response()->json($question_item);
        $question_item->description = $request->description;
        $request->correct_item ?
            $question_item->correct_item = $request->correct_item : $question_item->correct_item = 0;
        $question_item->save();


        return response()->json($question_item, 200);

    }

    public function destroy($id)
    {
        $question_item = QuestionItem::find($id);

        if(!$question_item){
            return response()->json([
                'message' => 'A Questão não foi encontrada.'
            ], 202);
        }

        $question = Question::find($question_item->fk_question_id);

        if($question->validated == 1){
            return response()->json([
                'message' => 'A Questão já foi validada.'
            ], 202);
        }

        $user = auth('api')->user();
        if($question->fk_user_id != $user->id){
            return response()->json([
                'message' => 'A Questão não pertence ao usuário logado.'
            ], 202);
        }

        $this->verifyRecord($question_item);

        $question_item->delete();

        return response()->json([
            'message' => 'Item de Questão '.$question_item->id.' excluído!'
        ], 200);
    }

    public function verifyRecord($record){
        if(!$record || $record == '[]'){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 404);
        }
    }
}
