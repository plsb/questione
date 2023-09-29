<?php

namespace App\Http\Controllers\Professor;

use App\Course;
use App\KnowledgeObject;
use App\Question;
use App\QuestionHasKnowledgeObject;
use Illuminate\Http\Request;
use Validator;
use App\Http\Controllers\Controller;

class QuestionHasKnowledgeObjectController extends Controller
{

    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkProfessor']);
    }

    private $rules = [
        'fk_question_id' => 'required',
        'fk_knowledge_object' => 'required',
    ];

    private $messages = [
        'fk_question_id.required' => 'A QUESTÃO é obrigatória.',

        'fk_knowledge_object.required' => 'O OBJETO DE CONHECIMENTO é obrigatório.',

    ];

    public function index($idQuestion){
        $question = Question::find($idQuestion);

        if(!$question){
            return response()->json([
                'message' => 'Questão não encontrado.'
            ], 202);
        }
        $user = auth('api')->user();
        if($user->id != $question->fk_user_id){
            return response()->json([
                'message' => 'A questão pertence a um outro usuário.'
            ], 202);
        }

        $itens = QuestionHasKnowledgeObject::where('fk_question_id', $question->id)
            ->with('object')
            ->get();

        return response()->json($itens, 200);
    }

    public function addKnowledgeObject(Request $request){

        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            return $validation->errors()->toJson();
        }

        $question = Question::find($request->fk_question_id);

        if(!$question){
            return response()->json([
                'message' => 'Questão não encontrada.'
            ], 202);
        }

        $user = auth('api')->user();
        if($user->id != $question->fk_user_id){
            return response()->json([
                'message' => 'A questão pertence a um outro usuário.'
            ], 202);
        }
        /*if($question->validated == 1){
            return response()->json([
                'message' => 'A questão já está validada.'
            ], 202);
        }*/

        $object = KnowledgeObject::find($request->fk_knowledge_object);
        if(!$object){
            return response()->json([
                'message' => 'Objeto de Conhecimento não encontrado.'
            ], 202);
        }

        /*$course = Course::find($question->fk_course_id);

        if($course->id != $object->fk_course_id){
            return response()->json([
                'message' => 'Objeto de Conhecimento não pertence ao curso informado.'
            ], 200);
        }*/

        $verifyObjectStore = QuestionHasKnowledgeObject::where('fk_question_id', "=", $request->fk_question_id)
            ->where('fk_knowledge_object', "=", $request->fk_knowledge_object)->get();
        //verifica se já cadastrou
        if(sizeof($verifyObjectStore)==0){
            $object = new QuestionHasKnowledgeObject();
            $object->fk_question_id = $request->fk_question_id;
            $object->fk_knowledge_object = $request->fk_knowledge_object;
            $object->save();
        } else {
            $object = $verifyObjectStore[0];
        }

        return response()->json($object, 201);

    }

    public function update(Request $request, $id){

        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            return $validation->errors()->toJson();
        }

        $objectQuestion = QuestionHasKnowledgeObject::where('id', "=", $id)->first();

        if(!$objectQuestion){
            return response()->json([
                'message' => 'Objeto não encontrado.'
            ], 202);
        }

        $question = Question::where('id', $objectQuestion->fk_question_id)->first();

        /*if($question->validated == 1){
            return response()->json([
                'message' => 'A questão já está validada.'
            ], 202);
        }*/

        $user = auth('api')->user();
        if($user->id != $question->fk_user_id){
            return response()->json([
                'message' => 'A questão pertence a um outro usuário.'
            ], 202);
        }

        $objectQuestion->fk_question_id = $request->fk_question_id;
        $objectQuestion->fk_knowledge_object = $request->fk_knowledge_object;
        $objectQuestion->save();

        return response()->json([
            'message' => 'Objeto Questão alterado.',
            $objectQuestion], 200);
    }


    public function deleteKnowledgeObject(Request $request, $id){

        $objectQuestion = QuestionHasKnowledgeObject::where('id', "=", $id)->first();

        if(!$objectQuestion){
            return response()->json([
                'message' => 'Objeto não encontrado.'
            ], 202);
        }

        $question = Question::where('id', $objectQuestion->fk_question_id)->first();

        /*if($question->validated == 1){
            return response()->json([
                'message' => 'A questão já está validada.'
            ], 202);
        }*/

        $user = auth('api')->user();
        if($user->id != $question->fk_user_id){
            return response()->json([
                'message' => 'A questão pertence a um outro usuário.'
            ], 202);
        }

        $objectQuestion->delete();

        return response()->json([
            'message' => 'Objeto Questão deletado.',
            $objectQuestion], 200);
    }
}
