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
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
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

    public function searchObjectsRelated(Request $request)
    {
        if(!$request->fk_course_id){
            return response()->json([
                'message' => 'Informe o curso.'
            ], 202);
        }
        $course = Course::where('id', $request->fk_course_id)
            ->with('regulations')->first();

        if(!$course){
            return response()->json([
                'message' => 'Curso não encontrado.'
            ], 202);
        } else if(!$course->fk_area_id){
            return response()->json([
                'message' => 'O curso não possui área relacionada.'
            ], 202);
        }

        $courses = Course::where('fk_area_id', $course->fk_area_id)->select('id')->get();


        $list_Objects = KnowledgeObject::whereIn('fk_course_id', $courses)
            ->select('id', 'description', 'fk_course_id', 'fk_regulation_id')
            ->with('course')
            ->with('regulation')
            ->orderBy('description')->get();

        $combinedPhrases = $this->encontrarPalavrasMaisParecidas($list_Objects);
        $array = array();
        //return response()->json($course, 200);
        foreach ($combinedPhrases as $item) {
            if (intval($item->obj->fk_course_id) == intval($course->id)) {

                foreach ($item->related as $value_related) {

                   if(($item->obj->regulation && $value_related->obj->regulation)
                            && ($item->obj->regulation->id == $value_related->obj->regulation->id)){
                            continue ;
                    }

                    $knowledge_related1 = KnowledgeObjectRelated::where('fk_obj1_id', $item->obj->id)
                        ->where('fk_obj2_id', $value_related->obj->id)
                        ->first();
                    $knowledge_related2 = KnowledgeObjectRelated::where('fk_obj2_id', $item->obj->id)
                        ->where('fk_obj1_id', $value_related->obj->id)
                        ->first();



                    if (!$knowledge_related1 && !$knowledge_related2) {
                        $object_relacted = (object)[
                            'id_1' => $item->obj->id,
                            'description_1' => $item->obj->description,
                            'course_1' => $item->obj->course->description,
                            'year_1' => $item->obj->regulation ? $item->obj->regulation->year : null,
                            'id_2' => $value_related->obj->id,
                            'description_2' => $value_related->obj->description,
                            'course_2' => $value_related->obj->course->description,
                            'year_2' => $value_related->obj->regulation ? $value_related->obj->regulation->year : null,
                            'cost' => $value_related->cost,
                        ];

                        $array[] = $object_relacted;
                    }


                }
            }

        }

       usort(
            $array,
            function( $a, $b ) {
                if( $a->cost == $b->cost ) return 0;
                return ( ( $a->cost > $b->cost ) ? -1 : 1 );
            }
        );


        return response()->json($array, 200);
    }

    private function verifyObject($id){
        $object = KnowledgeObject::find($id);

        return $object;
    }

    private function calcularSimilaridadeLevenshtein($palavra1, $palavra2) {
        $palavra1 = strtolower($palavra1);
        $palavra2 = strtolower($palavra2);
        return (1 - levenshtein($palavra1, $palavra2)/max(strlen($palavra1), strlen($palavra2)))*100;
    }

    // Função para encontrar as palavras mais parecidas na lista
    private function encontrarPalavrasMaisParecidas($lista_palavras) {
        $resultado = array();

        foreach ($lista_palavras as $obj1) {
            $custo_minimo = 60; //coeficiente de similaridade, ou seja tem ser parecido 60% ou mais
            $obj_mais_parecido = null;
            $palavra1 = $obj1->description;
            $related = array();

            foreach ($lista_palavras as $obj2) {
                $palavra2 = $obj2->description;
                if ($obj1->id !== $obj2->id) {

                    $custo = round($this->calcularSimilaridadeLevenshtein($palavra1, $palavra2), 2);

                    if ($custo >= $custo_minimo) {
                        //$similaridade_minima = $similaridade;
                        $obj_mais_parecido = $obj2;

                        $object_relacted = (object)[
                            'obj' => $obj2,
                            'cost' => $custo,
                        ];

                        $related[] = $object_relacted;

                    }

                }
            }
            $object = (object)[
                'obj' => $obj1,
                'related' => $related,
            ];

            $resultado[] = $object;
        }

        return $resultado;
    }
}
