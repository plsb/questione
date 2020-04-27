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

    public function addKnowledgeObject(Request $request){

        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            return $validation->errors()->toJson();
        }

        $question = Question::find($request->fk_question_id);

        if(!$question){
            return response()->json([
                'message' => 'Questão não encontrado.'
            ], 203);
        }

        $user = auth('api')->user();
        if($user->id != $question->fk_user_id){
            return response()->json([
                'message' => 'Operação não permitida. A questão pertence a um outro usuário.'
            ], 203);
        } else if($question->validated == 1){
            return response()->json([
                'message' => 'Operação não permitida. A questão já está validada.'
            ], 203);
        }

        $object = KnowledgeObject::find($request->fk_knowledge_object);
        if(!$object){
            return response()->json([
                'message' => 'Objeto de Conhecimento não encontrado.'
            ], 203);
        }

        $verifyObjectStore = QuestionHasKnowledgeObject::where('fk_question_id', "=", $request->fk_question_id)
            ->where('fk_knowledge_object', "=", $request->fk_knowledge_object)->get();
        if(sizeof($verifyObjectStore)>0){
            return response()->json([
                'message' => 'O Objeto de Conhecimento já foi cadastrado para esta questão.'
            ], 203);
        }
        $course = Course::find($question->fk_course_id);

        if($course->id != $object->fk_course_id){
            return response()->json([
                'message' => 'Operação não permitida. Objeto de Conhecimento não pertence ao curso informado.'
            ], 203);
        }

        $object = new QuestionHasKnowledgeObject();
        $object->fk_question_id = $request->fk_question_id;
        $object->fk_knowledge_object = $request->fk_knowledge_object;
        $object->save();

        return response()->json($object);

    }

    public function deleteKnowledgeObject(Request $request){

        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            return $validation->errors()->toJson();
        }

        $question = Question::find($request->fk_question_id);
        if(!$question){
            return response()->json([
                'message' => 'Questão não encontrado.'
            ], 203);
        } else if($question->validated == 1){
            return response()->json([
                'message' => 'Operação não permitida. A questão já está validada.'
            ], 203);
        }

        $user = auth('api')->user();
        if($user->id != $question->fk_user_id){
            return response()->json([
                'message' => 'Operação não permitida. A questão pertence a um outro usuário.'
            ], 203);
        }

        $object = KnowledgeObject::find($request->fk_knowledge_object);
        if(!$object){
            return response()->json([
                'message' => 'Objeto de Conhecimento não encontrado.'
            ], 203);
        }

        $verifyObjectStore = QuestionHasKnowledgeObject::where('fk_question_id', "=", $request->fk_question_id)
            ->where('fk_knowledge_object', "=", $request->fk_knowledge_object)->get();
        foreach ($verifyObjectStore as $value) {
            $value->delete();
        }

        return response()->json([
            'message' => 'Objetos excluído!'
        ], 202);
    }
}
