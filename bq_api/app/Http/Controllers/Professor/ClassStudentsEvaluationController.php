<?php

namespace App\Http\Controllers\Professor;

use App\ClassQuestione;
use App\ClassStudents;
use App\Course;
use App\CourseProfessor;
use App\Evaluation;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;
use DB;

class ClassStudentsEvaluationController extends Controller
{
    /*
     * Status 1 - Ativa
     * Status 2 - Arquivada
     */
    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkProfessor']);
    }

    private $rules = [
        'description' => 'required|max:300|min:4',
        'fk_class_id' => 'required',
    ];

    private $messages = [
        'description.required' => 'A DESCRIÇÃO é obrigatória.',
        'description.max' => 'O máximo de alfanuméricos aceitáveis para a DESCRIÇÃO é 300.',
        'description.min' => 'O minímo de alfanuméricos aceitáveis para a DESCRIÇÃO é 04.',
        'fk_class_id' => 'A TURMA é obrigatória'
    ];

    public function index(Request $request)
    {
        $user = auth('api')->user();
        DB::enableQueryLog();

        //pesquisa por codigo ou descrição
        //dd($request->id_evaluation);
        if($request->id_evaluation || $request->description){
            $evaluation = Evaluation::where('fk_user_id', '=', $user->id)
                ->where('status', 1)
                ->where('fk_class_id', $$request->fk_class_id)
                ->where('practice', 0)
                ->where(
                    function ($query) use ($request) {
                        $query->where('description', 'like', $request->description ? '%'.$request->description.'%' : null);
                    })
                ->orderBy('created_at', 'desc')
                ->with('user')
                ->paginate(10);
        } else {
            $evaluation = Evaluation::where('fk_user_id', '=', $user->id)
                ->where('status', 1)
                ->where('fk_class_id', $$request->fk_class_id)
                ->where('practice', 0)
                ->orderBy('created_at', 'desc')
                ->with('user')
                ->paginate(10);
        }

        $queries = DB::getQueryLog();
        //dd($queries);

        return response()->json($evaluation, 200);
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
        $class = ClassQuestione::where('id', '=', $request->fk_class_id)
           ->first();

        if($class != null){
            $user = auth('api')->user();
            if($class->fk_user_id != $user->id){
                return response()->json([
                    'message' => 'A Turma pertence a outro professor.'
                ], 202);
            }
        } else {
            return response()->json([
                'message' => 'Turma não encontrada.'
            ], 202);
        }

        $user = auth('api')->user();

        $evaluation = new Evaluation();
        $evaluation->description = $request->description;

        $evaluation->status = 1;
        $evaluation->fk_class_id = $request->fk_class_id;

        $evaluation->fk_user_id = $user->id;
        $evaluation->practice = 0;

        $evaluation->save();

        return response()->json([
            'message' => 'Avaliação cadastrada.',
            $evaluation
        ], 200);
    }

    public function update(Request $request, $id)
    {

        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        $user = auth('api')->user();
        $evaluation = Evaluation::find($id);

        if($evaluation->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Operação não pode ser realizada. A avaliação pertence a outro usuário.'
            ], 202);
        }

        $this->verifyRecord($evaluation);
        $evaluation->description = $request->description;

        $evaluation->save();


        return response()->json([
            'message' => 'Avaliação atualizada.',
            $evaluation
        ], 200);

    }

    public function verifyRecord($record){
        if(!$record || $record == '[]'){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 202);
        }
    }

}
