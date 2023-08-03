<?php

namespace App\Http\Controllers\Professor;

use App\ClassGamificationScoreSettings;
use App\ClassGamificationSettings;
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
        'fk_course_id' => 'required',
    ];

    private $messages = [
        'description.required' => 'A DESCRIÇÃO é obrigatória.',
        'description.max' => 'O máximo de alfanuméricos aceitáveis para a DESCRIÇÃO é 300.',
        'description.min' => 'O minímo de alfanuméricos aceitáveis para a DESCRIÇÃO é 04.',
        'fk_course_id.required' => 'O CURSO é obrigatório.',
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
                ->with('course')
                ->paginate(10);
        } else {
            $class = ClassQuestione::where('fk_user_id', '=', $user->id)
                ->where('status', $request->status)
                ->orderBy('created_at', 'desc')
                ->with('user')
                ->with('course')
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
                ->with('course')
                ->paginate(10);
        } else {
            $class_professor_are_student = ClassQuestione::whereIn('id', $arr)
                ->orderBy('created_at', 'desc')
                ->with('user')
                ->with('course')
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

        $course = Course::where('id', $request->fk_course_id)->first();
        if(!$course){
            return response()->json([
                'message' => 'O curso não foi encontrado.'
            ], 202);
        }

        $user = auth('api')->user();

        $class = new ClassQuestione();
        $class->description = $request->description;
        $class->fk_course_id = $request->fk_course_id;
        $class->gamified_class = 0;
        if($request->gamified_class){
            $class->gamified_class = $request->gamified_class;
        }

        $class->status = 1;
        $class->fk_user_id = $user->id;

        $token = bin2hex(random_bytes(1));
        $id_class = mb_strtoupper("C".substr(date('Y'), -2)."".date('Gis')."".$token);

        $class->id_class = $id_class;

        $class->save();

        if($class->gamified_class == 1){
            $this->storeGamificationSettings($class->id);
        }

        return response()->json([
            'message' => 'Turma cadastrada.',
            $class
        ], 200);
    }

    public function show(int $id)
    {
        $user = auth('api')->user();

        $class = ClassQuestione::where('id', '=', $id)
            ->with('user')
            ->with('course')
            ->first();

        if(!$class){
            return response()->json([
                'message' => 'Turma não encontrada.'
            ], 202);
        }

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

        $course = Course::where('id', $request->fk_course_id)->first();
        if(!$course){
            return response()->json([
                'message' => 'O curso não foi encontrado.'
            ], 202);
        }

        $class->description = $request->description;
        $class->fk_course_id = $request->fk_course_id;
        if($request->gamified_class){
            $class->gamified_class = $request->gamified_class;
        }
        $class->gamified_class = 0;
        if($request->gamified_class){
            $class->gamified_class = $request->gamified_class;
        }
        //verifica se já existe itens nas configurações da classe, caso não adiciona
        if($class->gamified_class == 1){
            $classGamificationSettings = ClassGamificationSettings::where('fk_class_id', '=', $class->id)->get();
            if(sizeof($classGamificationSettings)==0){
                $this->storeGamificationSettings($class->id);
            }

        }
        $class->save();

        return response()->json([
            'message' => 'Turma atualizada.',
            $class
        ], 200);

    }

    public function changeStatus($id, Request $request)
    {
        //ativa e inativa a turma
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

    public function courses(Request $request)
    {
        //traz os cursos que o professor tem permissão
        $user = auth('api')->user();

        $cp = CourseProfessor::where('fk_user_id',$user->id)
            ->orderBy('created_at','DESC')
            ->with('user')
            ->with('course')->get();

        $arr = array();
        foreach ($cp as $key){
            //dd($enaq);
            $arr[] = $key->course;
        }

        return response()->json($arr, 200);
    }
    public function classesProfessor(Request $request){
        //traz as classe que o professor tem cadastradas
        if(!$request->status){
            return response()->json([
                'message' => 'Informe o status: (1)Ativa ou (2)Arquivada.'
            ], 202);
        }

        $user = auth('api')->user();

        $classes = ClassQuestione::where('fk_user_id',$user->id)
            ->where('status', $request->status)
            ->orderBy('created_at','DESC')
            ->with('user')
            ->with('course')->get();

        return response()->json($classes, 200);
    }

    private function storeGamificationSettings($class_id){
        $classGamificationSettings = new ClassGamificationSettings();
        $classGamificationSettings->description_id = 'enter_class';
        $classGamificationSettings->description = 'Quando entrar na turma';
        $classGamificationSettings->fk_class_id = $class_id;
        $classGamificationSettings->XP = 0;
        $classGamificationSettings->PR = 50;
        $classGamificationSettings->save();

        $classGamificationSettings = new ClassGamificationSettings();
        $classGamificationSettings->description_id = 'mark_correct_question';
        $classGamificationSettings->description = 'Acertar uma questão';
        $classGamificationSettings->fk_class_id = $class_id;
        $classGamificationSettings->XP = 10;
        $classGamificationSettings->PR = 0;
        $classGamificationSettings->save();

        $classGamificationSettings = new ClassGamificationSettings();
        $classGamificationSettings->description_id = 'complete_a_test';
        $classGamificationSettings->description = 'Finalizar um simulado';
        $classGamificationSettings->fk_class_id = $class_id;
        $classGamificationSettings->XP = 10;
        $classGamificationSettings->PR = 10;
        $classGamificationSettings->save();


        $classGamificationSettings = new ClassGamificationSettings();
        $classGamificationSettings->description_id = 'correctly_mark_all_questions';
        $classGamificationSettings->description = 'Acertar todas as questões de um simulado';
        $classGamificationSettings->fk_class_id = $class_id;
        $classGamificationSettings->XP = 20;
        $classGamificationSettings->PR = 20;
        $classGamificationSettings->save();

        $classGamificationSettings = new ClassGamificationSettings();
        $classGamificationSettings->description_id = 'get_badge';
        $classGamificationSettings->description = 'Conquistar emblema';
        $classGamificationSettings->fk_class_id = $class_id;
        $classGamificationSettings->XP = 0;
        $classGamificationSettings->PR = 0;
        $classGamificationSettings->save();
    }

}
