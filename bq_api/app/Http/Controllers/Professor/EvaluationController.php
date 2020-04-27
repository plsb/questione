<?php

namespace App\Http\Controllers\Professor;

use App\Evaluation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;

class EvaluationController extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkProfessor']);
    }

    private $rules = [
        'description' => 'required',
    ];

    private $messages = [
        'description.required' => 'A DESCRIÇÃO é obrigatória.',
    ];

    public function index()
    {
        //retorna todas as questões do usuário ativo
        $user = auth('api')->user();

        $evaluation = Evaluation::where('fk_user_id', '=', $user->id)
            ->orderBy('id')
            ->with('user')
            ->paginate(10);
        return response()->json($evaluation);
    }

    public function store(Request $request)
    {
        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            return $validation->errors()->toJson();
        }

        $user = auth('api')->user();

        $evaluation = new Evaluation();
        $evaluation->description = $request->description;

        //ano 		Horas/minutos/segundos e id PRofessor
        $evaluation->id_evaluation = date('Y')."".date('Gis')."".$user->id;

        $evaluation->fk_user_id = $user->id;

        if($request->students_can_see_fedback){
            $evaluation->students_can_see_fedback = $request->students_can_see_fedback;
        } else {
            $evaluation->students_can_see_fedback = 0;
        }

        if($request->studentes_can_see_comments_items){
            $evaluation->studentes_can_see_comments_items = $request->studentes_can_see_comments_items;
        } else {
            $evaluation->studentes_can_see_comments_items = 0;
        }

        $evaluation->save();

        return response()->json($evaluation, 201);
    }

    public function show(int $id)
    {
        $evaluation = Evaluation::where('id', '=', $id)
            ->with('user')
           // ->with('questions')
            ->get();

        $this->verifyRecord($evaluation);

        return response()->json($evaluation);
    }

    public function update(Request $request, $id)
    {
        //return response()->json($request);
        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            return $validation->errors()->toJson();
        }

        $user = auth('api')->user();
        $evaluation = Evaluation::find($id);

        if($evaluation->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Operação não pode ser realizada. A avaliação pertence a outro usuário.'
            ], 204);
        }

        $this->verifyRecord($evaluation);
        $students_can_see_fedback = $evaluation->students_can_see_fedback;
        $studentes_can_see_comments_items = $evaluation->studentes_can_see_comments_items;


        $evaluation->description = $request->description;
        if($request->students_can_see_fedback){
            $evaluation->students_can_see_fedback = $request->students_can_see_fedback;
        } else {
            $evaluation->students_can_see_fedback = 0;
        }

        if($request->studentes_can_see_comments_items){
            $evaluation->studentes_can_see_comments_items = $request->studentes_can_see_comments_items;
        } else {
            $evaluation->studentes_can_see_comments_items = 0;
        }
       // return response()->json( $evaluation->students_can_see_fedback);
        $evaluation->save();


        return response()->json($evaluation);

    }

    public function destroy($id)
    {
        //falta fazer funcao
    }

    public function verifyRecord($record){
        if(!$record || $record == '[]'){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 404);
        }
    }

}
