<?php

namespace App\Http\Controllers\Adm;

use App\Course;
use App\KnowledgeArea;
use App\Question;
use Illuminate\Http\Request;
use Validator;
use App\Http\Controllers\Controller;

class AreaController extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkAdm']);
    }

    private $rules = [
        'description' => 'required|max:100|min:4',

    ];

    private $messages = [
        'description.required' => 'A DESCRIÇÃO é obrigatório.',
        'description.max' => 'O máximo de alfanuméricos aceitáveis para a DESCRIÇÃO é 100.',
        'description.min' => 'O minímo de alfanuméricos aceitáveis para a DESCRIÇÃO é 04.',
    ];

    public function index(Request $request)
    {
        if($request->description){
            $area = KnowledgeArea::where('description', 'like', '%'.$request->description.'%')
                ->orderBy('description')
                ->paginate(10);
        } else {
            $area = KnowledgeArea::orderBy('description')->paginate(10);
        }

        return response()->json($area, 200);
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

        $area = new KnowledgeArea();
        $area->description = $request->description;
        $area->save();

        return response()->json([
            'message' => 'Área '.$area->description.' cadastrada.',
            $area
        ], 200);
    }

    public function show(int $id)
    {
        $area = KnowledgeArea::find($id);

        if(!$area){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 202);
        }

        return response()->json($area, 200);
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

        $area = KnowledgeArea::find($id);

        if(!$area){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 202);
        }

        $area->description = $request->description;
        $area->save();

        return response()->json([
            'message' => 'Área '.$area->description.' atualizada.',
            $area
        ], 200);
    }

    public function destroy($id)
    {
        $area = KnowledgeArea::find($id);

        if(!$area){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 202);
        }

        $courses = Course::where('fk_area_id', '=', $id)->get();
        if(sizeof($courses)>0) {
            return response()->json(['message' => 'Operação não realizada. Existem cursos para esta área.'], 202);
        }

        $area->delete();

        return response()->json([
            'message' => 'Área '.$area->description.' excluída.',
            $area
        ], 200);
    }
}
