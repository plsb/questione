<?php

namespace App\Http\Controllers\Professor;

use App\ClassQuestione;
use App\ClassStudents;
use App\Evaluation;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;
use DB;

class ClassController extends Controller
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
    ];

    private $messages = [
        'description.required' => 'A DESCRIÇÃO é obrigatória.',
        'description.max' => 'O máximo de alfanuméricos aceitáveis para a DESCRIÇÃO é 300.',
        'description.min' => 'O minímo de alfanuméricos aceitáveis para a DESCRIÇÃO é 04.',
    ];

    public function index(Request $request)
    {
        //retorna todas as avaliações do usuário ativo
        if(!$request->status){
            return response()->json([
                'message' => 'Informe o status: (1)Ativa ou (2)Arquivada.'
            ], 202);
        }
        $user = auth('api')->user();
        DB::enableQueryLog();

        //pesquisa por codigo ou descrição
        //dd($request->id_evaluation);
        if($request->description){
            $class = ClassQuestione::where('fk_user_id', '=', $user->id)
                ->where('status', $request->status)
                ->where(
                function ($query) use ($request) {
                    $query->where('description', 'like', $request->description ? '%'.$request->description.'%' : null);
                     })
                ->orderBy('created_at', 'desc')
                ->with('user')
                ->paginate(10);
        } else {
            $class = ClassQuestione::where('fk_user_id', '=', $user->id)
                ->where('status', $request->status)
                ->orderBy('created_at', 'desc')
                ->with('user')
                ->paginate(10);
        }

        $queries = DB::getQueryLog();
        //dd($queries);

        $class_students_student = ClassStudents::where('fk_user_id',$user->id)
            ->get();

        $arr = array();
        foreach ($class_students_student as $class_s){
            //dd($enaq);
            $arr[] = $class_s->fk_class_id;
        }

        /*
         * Essa função abaixo é muito simular a contida no
         * ClassStudentsStudent. O motivo é que o professor poderá ter turmas
         * que gerencia e turmas em que ele tem funnção de aluno
         */
        $class_students_student = ClassStudents::where('fk_user_id',$user->id)
            ->get();

        $arr = array();
        foreach ($class_students_student as $class_s){
            //dd($enaq);
            $arr[] = $class_s->fk_class_id;
        }

        $class_professor_are_student = [];

        if($request->description){
            $class_professor_are_student = ClassQuestione::whereIn('id', $arr)
                ->where(
                    function ($query) use ($request) {
                        $query->where('description', 'like', $request->description ? '%'.$request->description.'%' : null);
                    })
                ->orderBy('created_at', 'desc')
                ->with('user')
                ->paginate(10);
        } else {
            $class_professor_are_student = ClassQuestione::whereIn('id', $arr)
                ->orderBy('created_at', 'desc')
                ->with('user')
                ->paginate(10);
        }
        /*
            O retorno é um array, nna posição

            [0] - turmas que o professor criou e gerencia
            [1] - turmas que o professor tem a função de aluno
        */
        return response()->json([$class, $class_professor_are_student], 200);
    }

    public function store(Request $request)
    {
        $class = Validator::make($request->all(),$this->rules, $this->messages);

        if($class->fails()){
            $erros = array('errors' => array(
                $class->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        $user = auth('api')->user();

        $class = new ClassQuestione();
        $class->description = $request->description;

        $class->status = 1;
        $class->fk_user_id = $user->id;

        $token = bin2hex(random_bytes(1));
        $id_class = mb_strtoupper("C".substr(date('Y'), -2)."".date('Gis')."".$token);

        $class->id_class = $id_class;

        $class->save();

        return response()->json([
            'message' => 'Turma cadastrada.',
            $class
        ], 200);
    }

    public function show(int $id)
    {
        $class = ClassQuestione::where('id', '=', $id)
            ->with('user')
            ->get();
        if(sizeof($class) == 0){
            return response()->json([
                'message' => 'Turma não encontrada.'
            ], 202);
        }
        return response()->json($class, 200);

        if($class->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Operação não pode ser realizada. A turma pertence a outro usuário.'
            ], 202);
        }

        return response()->json($class, 200);
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
        $class = ClassQuestione::find($id);

        if($class->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Operação não pode ser realizada. A turma pertence a outro usuário.'
            ], 202);
        }

        $class->description = $request->description;
        $class->save();

        return response()->json([
            'message' => 'Turma atualizada.',
            $class
        ], 200);

    }

    public function changeStatus($id, Request $request)
    {
        $user = auth('api')->user();
        $class = ClassQuestione::find($id);

        if($class->fk_user_id != $user->id){
            return response()->json([
                'message' => 'A turma pertence a outro usuário.'
            ], 202);
        }

        if(!$request->status){
            return response()->json([
                'message' => 'Informe o status: (1)Ativa ou (2)Arquivada.'
            ], 202);
        }
        $class->status = $request->status;
        $class->save();

        if($request->status == 1){
            $message = 'Turma ativa.';
        } else {
            $message = 'Turma arquivada.';
        }

        return response()->json([
            'message' => $message,
            $class
        ], 200);

    }

}
