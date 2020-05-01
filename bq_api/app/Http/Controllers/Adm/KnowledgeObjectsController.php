<?php

namespace App\Http\Controllers\Adm;

use App\KnowledgeObject;
use Illuminate\Http\Request;
use Validator;
use App\Course;
use App\Http\Controllers\Controller;

class KnowledgeObjectsController extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkAdm']);
    }

    private $rules = [
        'description' => 'required|max:300|min:10',
        'fk_course_id' => 'required',

    ];

    private $messages = [
        'description.required' => 'A DESCRIÇÃO é obrigatória.',
        'description.max' => 'O máximo de caracteres aceitáveis para a DESCRIÇÃO é 300.',
        'description.min' => 'O minímo de caracteres aceitáveis para a DESCRIÇÃO é 10.',

        'fk_course_id.required' => 'O CURSO é obrigatório.',

    ];

    public function index(Request $request)
    {
        if($request->fk_course_id)
        {
            $knowledge_objects = KnowledgeObject::where('fk_course_id', '=', $request->fk_course_id)
                ->orderBy('description')
                ->with('course')
                ->paginate(10);
        } else {
            $knowledge_objects = KnowledgeObject::orderBy('fk_course_id')->with('course')->paginate(10);
        }

        return response()->json($knowledge_objects, 200);
    }

    public function store(Request $request)
    {
        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            return $validation->errors()->toJson();
        }

        if(!$this->verifyCourse($request->fk_course_id)){
            return response()->json([
                'message' => 'Objeto d e Conhecimento não encontrado.'
            ], 202);
        }

        $knowledge_object = new KnowledgeObject();
        $knowledge_object->description = $request->description;
        $knowledge_object->fk_course_id = $request->fk_course_id;
        $knowledge_object->save();

        return response()->json([
            'message' => 'Objeto de Conhecimento '.$knowledge_object->description.' cadastrado.',
            $knowledge_object
        ], 200);
    }

    public function show(int $id)
    {
        $knowledge_object = KnowledgeObject::where('id', '=', $id)->with('course')->get();

        $this->verifyRecord($knowledge_object);

        return response()->json($knowledge_object, 200);
    }

    public function update(Request $request, $id)
    {
        $validation = Validator::make($request->all(), $this->rules, $this->messages);

        if($validation->fails()){
            return $validation->errors()->toJson();
        }

        if(!$this->verifyCourse($request->fk_course_id)){
            return response()->json([
                'message' => 'Objeto de Conhecimento não encontrado.'
            ], 202);
        }

        $knowledge_object = KnowledgeObject::find($id);

        $this->verifyRecord($knowledge_object);

        $knowledge_object->description = $request->description;
        $knowledge_object->fk_course_id = $request->fk_course_id;
        $knowledge_object->save();


        return response()->json([
            'message' => 'Objeto de Conhecimento '.$knowledge_object->description.' atualizado.',
            $knowledge_object
        ], 200);

    }

    public function destroy($id)
    {
        $knowledge_object = KnowledgeObject::find($id);

        $this->verifyRecord($knowledge_object);

        $knowledge_object->delete();

        return response()->json([
            'message' => 'Objeto de Conhecimento '.$knowledge_object->description.' excluído!'
        ], 200);
    }

    public function verifyRecord($record){
        if(!$record || $record == '[]'){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 202);
        }
    }

    private function verifyCourse($id){
        $course = Course::find($id);
        if(!$course){
            return false;
        }
        return true;
    }
}
