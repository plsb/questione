<?php

namespace App\Http\Controllers;

use App\ClassQuestione;
use App\ClassStudents;
use Illuminate\Http\Request;
use Validator;

class ClassStudentsStudent extends Controller
{
    private $rules = [
        'id_class' => 'required',

    ];

    private $messages = [
        'id_class.required' => 'O código da Turma é obrigatório.',
    ];

    public function __construct()
    {
        $this->middleware(['jwt.auth']);
    }

    public function index(Request $request)
    {
        $user = auth('api')->user();

        $class_students_student = ClassStudents::where('fk_user_id',$user->id)
            ->get();

        if(sizeof($class_students_student)==0){
            return response()->json([
                'message' => 'O usuário não possui turmas.'
            ], 202);
        }

        $arr = array();
        foreach ($class_students_student as $class_s){
            //dd($enaq);
            $arr[] = $class_s->fk_class_id;
        }

        $class = [];

        if($request->description){
            $class = ClassQuestione::whereIn('id', $arr)
                ->where(
                    function ($query) use ($request) {
                        $query->where('description', 'like', $request->description ? '%'.$request->description.'%' : null);
                    })
                ->orderBy('created_at', 'desc')
                ->with('user')
                ->paginate(10);
        } else {
            $class = ClassQuestione::whereIn('id', $arr)
                ->orderBy('created_at', 'desc')
                ->with('user')
                ->paginate(10);
        }

        return response()->json($class, 200);
    }

    //adicionar uma nova turma
    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), $this->rules, $this->messages);

        if ($validation->fails()) {
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        $class_verify = ClassQuestione::where('id_class', $request->id_class)->first();

        if (!$class_verify) {
            return response()->json([
                'message' => 'A Turma não foi encontrada.'
            ], 202);
        }

        $user = auth('api')->user();

        if($class_verify->fk_user_id == $user->id){
            return response()->json([
                'message' => 'A Turma pertence ao usuário ativo.'
            ], 202);
        }

        $class_students_student_verify = ClassStudents::where('fk_user_id', $user->id)
            ->where('fk_class_id', $class_verify->id)
            ->first();

        if($class_students_student_verify){
            return response()->json([
                'message' => 'O usuário já está cadastrado na turma.'
            ], 202);
        }

        $class_students_student = new ClassStudents();
        $class_students_student->fk_user_id = $user->id;
        $class_students_student->fk_class_id = $class_verify->id;
        $class_students_student->active = 1;
        $class_students_student->save();

        return response()->json([
            'message' => 'Turma adicionada.',
            $class_students_student
        ], 200);
    }

    //trazer informações (nome de professores e alunos) da turma
    public function details($id)
    {
        if (!$id) {
            return response()->json([
                'message' => 'Informe o código da turma.'
            ], 202);
        }

        $class_verify = ClassQuestione::where('id_class', $id)->first();

        if (!$class_verify) {
            return response()->json([
                'message' => 'A Turma não foi encontrada.'
            ], 202);
        }

        $user = auth('api')->user();

        $class_students_student = ClassStudents::where('fk_user_id',$user->id)
            ->where('fk_class_id', $class_verify->id)
            ->get();

        if(sizeof($class_students_student)==0){
            return response()->json([
                'message' => 'O usuário não está cadastrado na turma informada.'
            ], 202);
        }

        $class_students = ClassStudents::where('fk_class_id', $class_verify->id)
            ->with('user')
            ->get();

        $arr = array();
        foreach ($class_students as $class_s){
            //dd($enaq);
            $arr[] = $class_s->user->name;
        }

        sort($arr);

        $object = (object) $arr;

        return response()->json($object, 200);
    }

    //deleta uma turma, caso o aluno não possua dados de questionários
    public function destroy($id)
    {

        $class_students_student = ClassStudents::find($id);

        if (!$class_students_student) {
            return response()->json([
                'message' => 'A inscrição do aluno não foi encontrada.'
            ], 202);
        }

        $user = auth('api')->user();
        if($user->id != $class_students_student->fk_user_id){
            return response()->json([
                'message' => 'A inscrição do aluno não pertence ao aluno logado.'
            ], 202);
        }

        //falta verificar se possui alguma restrição de dependência

        $class_students_student->delete();

        return response()->json([
            'message' => 'A inscrição '.$class_students_student->id.' foi excluída.',
            $class_students_student
        ], 200);
    }


}
