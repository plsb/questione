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

class ClassStudentsProfessor extends Controller
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
        //'description' => 'required|max:300|min:4',
    ];

    private $messages = [
        //'description.required' => 'A DESCRIÇÃO é obrigatória.',
    ];

    public function index(Request $request)
    {
        //retorna todas as avaliações do usuário ativo
        if(!$request->id_class){
            return response()->json([
                'message' => 'Informe o código da turma.'
            ], 202);
        }

        $class = ClassQuestione::where('id_class', $request->id_class)
            ->first();

        $user = auth('api')->user();

        if($class->fk_user_id != $user->id){
            return response()->json([
                'message' => 'A Turma pertence a outro usuário.'
            ], 202);
        }

        if(!$class){
            return response()->json([
                'message' => 'A Turma não foi encontrada.'
            ], 202);
        }

        $class_students_student = ClassStudents::where('fk_class_id',$class->id)
            ->with('user')
            ->with('classQuestione')
            ->get();

        return response()->json($class_students_student, 200);
    }

    /*public function changeStatusStudent($id, Request $request)
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

    }*/

}
