<?php

namespace App\Http\Controllers\Adm;

use App\KnowledgeObject;
use App\Providers\KnowledgeObjectRelated;
use App\Regulation;
use App\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Validator;
use App\Http\Controllers\Controller;

class RegulationController extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkAdm']);
    }

    private $rules = [
        'description' => 'required|max:200|min:4',
        'year' => 'required',
        'fk_course_id' => 'required',

    ];

    private $messages = [
        'description.required' => 'A DESCRIÇÃO é obrigatório.',
        'description.max' => 'O máximo de alfanuméricos aceitáveis para a DESCRIÇÃO é 100.',
        'description.min' => 'O minímo de alfanuméricos aceitáveis para a DESCRIÇÃO é 04.',

        'year.required' => 'O ANO é obrigatório.',

        'fk_course_id.required' => 'O CURSO é obrigatório.',

    ];

    public function index(Request $request)
    {
        if($request->fk_course_id){
            $regulations = Regulation::where('fk_course_id', $request->fk_course_id)
                ->orderBy('year', 'desc')
                ->with('course')
                ->paginate(10);
        } else {
            $regulations = Regulation::orderBy('year', 'desc')
                ->with('course')
                ->paginate(10);
        }

        return response()->json($regulations, 200);
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

        $regulation = new Regulation();
        $regulation->year = $request->year;
        $regulation->description = $request->description;
        $regulation->fk_course_id = $request->fk_course_id;
        $regulation->save();

        return response()->json([
            'message' => 'Portaria '.$regulation->description.' cadastrada.',
            $regulation
        ], 200);
    }

    public function show(int $id)
    {
        /*$regulation = Regulation::where('id', $id)
            ->with('course')
            ->with('knowledgeObject')
            ->first();

        if(!$this->verifyRecord($regulation)){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 202);
        }

        return response()->json($regulation, 200);*/
        $regulation = Regulation::where('id', $id)
            ->with('course')
            ->first();

        $knowledge_object = KnowledgeObject::where('fk_regulation_id', $regulation->id)
            ->orderBy('description')
            ->get();

        $array_ko = array();
        foreach ($knowledge_object as $ko){

            $ko_related1 = KnowledgeObjectRelated::where('fk_obj2_id', $ko->id)->select('fk_obj1_id')->get();
            $ko_related2 = KnowledgeObjectRelated::where('fk_obj1_id', $ko->id)->select('fk_obj2_id')->get();
            $ids_ko = array();
            foreach ($ko_related1 as $ko1){
                $ids_ko[] = $ko1->fk_obj1_id;
            }
            foreach ($ko_related2 as $ko2){
                $ids_ko[] = $ko2->fk_obj2_id;
            }

            $ko_related_select = KnowledgeObject::whereIn('id', $ids_ko)
                ->with('regulation')
                ->with('course')
                ->get();

            $object_ko = (object)[
                'id' => $ko->id,
                'description' => $ko->description,
                'fk_course_id' => $ko->fk_course_id,
                'fk_regulation_id' => $ko->fk_regulation_id,
                'id_related' => $ko_related_select,
                'related' => $ko_related_select,
            ];
            $array_ko[] = $object_ko;

        }

        $object_regulation = (object)[
            'id' => $regulation->id,
            'description' => $regulation->description,
            'year' => $regulation->year,
            'fk_course_id' => $regulation->fk_course_id,
            'course' => $regulation->course,
            'knowledge_object' => $array_ko,
        ];

        return response()->json($object_regulation, 200);
    }

    public function update(Request $request, $id)
    {
        $validation = Validator::make($request->all(), $this->rules, $this->messages);

        if($validation->fails()){
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        $regulation = Regulation::find($id);

        if(!$this->verifyRecord($regulation)){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 202);
        }

        $regulation->year = $request->year;
        $regulation->description = $request->description;
        $regulation->fk_course_id = $request->fk_course_id;
        $regulation->save();

        return response()->json([
            'message' => 'Curso '.$regulation->description.' atualizado.',
            $regulation
        ], 200);
    }

    public function destroy($id)
    {
        $regulation = Regulation::find($id);

        if(!$this->verifyRecord($regulation)){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 202);
        }

        $skill = Skill::where('fk_regulation_id', '=', $id)->get();
        if(sizeof($skill)>0) {
            return response()->json(['message' => 'Operação não realizada. Existem habilidades para esta portaria.'], 202);
        }

        $know_objects = KnowledgeObject::where('fk_regulation_id', '=', $id)->get();
        if(sizeof($know_objects)>0) {
            return response()->json(['message' => 'Operação não realizada. Existem conteúdos para esta portaria.'], 202);
        }

        $regulation->delete();

        return response()->json([
            'message' => 'Curso '.$regulation->description.' excluído.',
            $regulation
        ], 200);
    }

    public function verifyRecord($record){
        if(!$record || $record == '[]'){
            return false;
        }
        return true;
    }

    public function allRegulation(Request $request)
    {
       /* $regulations = Regulation::orderBy('year', 'desc')
            ->with('course')
            ->paginate(10);*/
        $regulations = DB::table('regulation')
            ->select('regulation.id',
                    'regulation.description',
                    'regulation.year',
                    'regulation.fk_course_id',
                    'regulation.fk_course_id',
                    'courses.description as course'
            )
            ->join('courses', 'regulation.fk_course_id', '=', 'courses.id')
            ->orderBy('courses.description')
            ->orderBy('regulation.year', 'desc')
            ->get();

        return response()->json($regulations, 200);
    }

    public function byCourse(Request $request, $id){

        $regulations = Regulation::where('fk_course_id', $id)
            ->orderBy('year', 'desc')
            ->get();

        return response()->json($regulations, 200);

    }
}
