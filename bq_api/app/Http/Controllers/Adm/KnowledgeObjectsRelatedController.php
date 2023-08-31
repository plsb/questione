<?php

namespace App\Http\Controllers\Adm;

use App\KnowledgeObject;
use App\Providers\KnowledgeObjectRelated;
use App\QuestionHasKnowledgeObject;
use App\Regulation;
use Illuminate\Http\Request;
use Validator;
use App\Course;
use App\Http\Controllers\Controller;

class KnowledgeObjectsRelatedController extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkAdm']);
    }

    private $rules = [
        'fk_obj1_id' => 'required',
        'fk_obj2_id' => 'required',

    ];

    private $messages = [
        'fk_obj1_id.required' => 'O conteúdo 1 é obrigatório.',
        'fk_obj2_id.required' => 'O conteúdo 2 é obrigatório.',

    ];

    public function index(Request $request)
    {

    }

    public function store(Request $request)
    {
        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            return $validation->errors()->toJson();
        }

        if($request->fk_obj1_id == $request->fk_obj2_id){
            return response()->json([
                'message' => 'Conteúdos iguais não podem ser relacionados.'
            ], 202);
        }

        $object1 = $this->verifyObject($request->fk_obj1_id);
        if(!$object1){
            return response()->json([
                'message' => 'Conteúdo 1 não encontrado.'
            ], 202);
        }

        $object2 = $this->verifyObject($request->fk_obj2_id);
        if(!$object2){
            return response()->json([
                'message' => 'Conteúdo 2 não encontrado.'
            ], 202);
        }
        if($object1->fk_regulation_id == $object2->fk_regulation_id){
            return response()->json([
                'message' => 'Conteúdos da mesma portaria não podem ser relacionados.'
            ], 202);
        }

        $ko_related_verify1 = KnowledgeObjectRelated::where('fk_obj1_id', $object1->id)
            ->where('fk_obj2_id', $object2->id)->first();
        $ko_related_verify2 = KnowledgeObjectRelated::where('fk_obj1_id', $object2->id)
            ->where('fk_obj2_id', $object1->id)->first();
        if($ko_related_verify1 || $ko_related_verify2){
            return response()->json([
                'message' => 'Relação de conteúdo já foi cadastrada.'
            ], 202);
        }

        $knowledge_object_related = new KnowledgeObjectRelated();
        $knowledge_object_related->fk_obj1_id = $request->fk_obj1_id;
        $knowledge_object_related->fk_obj2_id = $request->fk_obj2_id;

        $knowledge_object_related->save();

        return response()->json([
            $knowledge_object_related
        ], 200);
    }

    public function show(int $id)
    {

    }

    public function destroy(Request $request, $id)
    {

        if(!$request->fk_obj2_id){
            return response()->json([
                'message' => 'Informe o conteúdo relacionado.'
            ], 202);
        }
        $relate1 = KnowledgeObjectRelated::where('fk_obj1_id', $id)
            ->where('fk_obj2_id', $request->fk_obj2_id)->first();

        $relate2 = KnowledgeObjectRelated::where('fk_obj1_id', $request->fk_obj2_id)
            ->where('fk_obj2_id',$id)->first();

        $wasDeleted = false;
        if($relate1) {
            $relate1->delete();
            $wasDeleted = true;
        }
        if($relate2) {
            $relate2->delete();
            $wasDeleted = true;
        }

        if(!$wasDeleted){
            return response()->json([
                'message' => 'Nenhum registro foi deletado.'
            ], 202);
        }

        return response()->json([
            'message' => 'Relação entre conteúdos excluída'
        ], 200);

    }

    private function verifyObject($id){
        $object = KnowledgeObject::find($id);

        return $object;
    }
}
