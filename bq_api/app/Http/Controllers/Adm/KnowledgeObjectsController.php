<?php

namespace App\Http\Controllers\Adm;

use App\KnowledgeObject;
use App\QuestionHasKnowledgeObject;
use App\Regulation;
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
        'description' => 'required|max:300|min:5',
        'fk_regulation_id' => 'required',

    ];

    private $messages = [
        'description.required' => 'A DESCRIÇÃO é obrigatória.',
        'description.max' => 'O máximo de caracteres aceitáveis para a DESCRIÇÃO é 300.',
        'description.min' => 'O minímo de caracteres aceitáveis para a DESCRIÇÃO é 5.',

        'fk_regulation_id.required' => 'A PORTARIA é obrigatória.',

    ];

    public function index(Request $request)
    {
        if($request->fk_course_id)
        {
            $id_regulation = $request->fk_regulation_id;
            $knowledge_objects = KnowledgeObject::where('fk_course_id', '=', $request->fk_course_id)
                ->when($id_regulation, function ($query, $id_regulation) {
                    //pega questões validadas de todos os usuário
                    return $query->where('fk_regulation_id', '=', $id_regulation);
                })
                ->orderBy('description')
                ->with('course')
                ->with('regulation')
                ->paginate(10);
        } else {
            $knowledge_objects = KnowledgeObject::orderBy('fk_course_id')
                ->with('course')
                ->with('regulation')
                ->paginate(10);
        }

        return response()->json($knowledge_objects, 200);
    }

    public function store(Request $request)
    {
        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            return $validation->errors()->toJson();
        }

        $regulation = $this->verifyRegulation($request->fk_regulation_id);
        if(!$regulation){
            return response()->json([
                'message' => 'Portaria não encontrada.'
            ], 202);
        }

        $knowledge_object = new KnowledgeObject();
        $knowledge_object->description = $request->description;
        $knowledge_object->fk_regulation_id = $request->fk_regulation_id;

        $knowledge_object->fk_course_id = $regulation->fk_course_id;
        $knowledge_object->save();

        return response()->json([
            'message' => 'Conteúdo '.$knowledge_object->description.' cadastrado.',
            $knowledge_object
        ], 200);
    }

    public function show(int $id)
    {
        $knowledge_object = KnowledgeObject::where('id', '=', $id)
            ->with('course')
            ->with('regulation')
            ->get();

        return response()->json($knowledge_object, 200);
    }

    public function update(Request $request, $id)
    {
        $validation = Validator::make($request->all(), $this->rules, $this->messages);

        if($validation->fails()){
            return $validation->errors()->toJson();
        }

        $regulation = $this->verifyRegulation($request->fk_regulation_id);
        if(!$regulation){
            return response()->json([
                'message' => 'Portaria não encontrada.'
            ], 202);
        }

        $knowledge_object = KnowledgeObject::find($id);

        $this->verifyRecord($knowledge_object);

        $knowledge_object->description = $request->description;
        $knowledge_object->fk_regulation_id = $request->fk_regulation_id;

        $knowledge_object->fk_course_id = $regulation->fk_course_id;
        $knowledge_object->save();


        return response()->json([
            'message' => 'Conteúdo '.$knowledge_object->description.' atualizado.',
            $knowledge_object
        ], 200);

    }

    public function destroy($id)
    {
        $knowledge_object = KnowledgeObject::find($id);

        $this->verifyRecord($knowledge_object);

        $question_knowledge_object = QuestionHasKnowledgeObject::where('fk_knowledge_object', $id)->get();
        if(sizeof($question_knowledge_object)>0) {
            return response()->json(['message' => 'Operação não realizada. Existem questões para este objeto de conhecimento.'], 202);
        }

        $knowledge_object->delete();

        return response()->json([
            'message' => 'Conteúdo '.$knowledge_object->description.' excluído!'
        ], 200);
    }

    public function verifyRecord($record){
        if(!$record || $record == '[]'){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 202);
        }
    }

    private function verifyRegulation($id){
        $regulation = Regulation::find($id);

        return $regulation;
    }
}
