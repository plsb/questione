<?php

namespace App\Http\Controllers\Professor;

use App\AnswersHeadEvaluation;
use App\ClassQuestione;
use App\ClassStudents;
use App\Evaluation;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
use App\Http\Controllers\Gamification\PointSystemController;
use App\User;
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

    public function addStudentClass(Request $request){

        $email = $request->email;
        $fk_class_id = $request->fk_class_id;

        $verifyRules = $this->verifyRules($email, $fk_class_id);
        if($verifyRules){
            return response()->json([
                'message' => $verifyRules
            ], 202);
        }

        $user = User::where('email', $email)->first();

        $verify = ClassStudents::where('fk_class_id', $fk_class_id)
            ->where('fk_user_id', $user->id)->first();

        if($verify){
            return response()->json([
                'message' => 'O estudante já foi cadastrado para esta turma.'
            ], 202);
        }

        $class_students_student = new ClassStudents();
        $class_students_student->fk_class_id = $fk_class_id;
        $class_students_student->fk_user_id = $user->id;
        $class_students_student->active = 1;
        $class_students_student->save();

        //pontuação XP ao entrar em uma sala de aula
        $class = ClassQuestione::find($fk_class_id);
        if($class->gamified_class) {
            $pointSystem = new PointSystemController();
            $pointSystem->RPpoint('enter_class', $fk_class_id, null, null,
                $user);
        }

        return response()->json([
            'message' => 'Estudante '.$user->name.', cadastrado na turma.'
        ], 200);

    }

    public function changeStatusActiveStudent(Request $request){

        $email = $request->email;
        $fk_class_id = $request->fk_class_id;

        $verifyRules = $this->verifyRules($email, $fk_class_id);
        if($verifyRules){
            return response()->json([
                'message' => $verifyRules
            ], 202);
        }

        $user = User::where('email', $email)->first();

        $classStudents = ClassStudents::where('fk_class_id', $fk_class_id)
            ->where('fk_user_id', $user->id)->first();


        $string = '';
        if($classStudents->active == 1){
            $classStudents->active = 0;
            $string = 'desabilitado';
        } else {
            $classStudents->active = 1;
            $string = 'habilitado';
        }


        $classStudents->save();

        return response()->json([
            'message' => 'Estudante '.$user->name.', '.$string.' com sucesso.',
            $classStudents
        ], 200);

    }

    public function destroy(Request $request){

        $email = $request->email;
        $fk_class_id = $request->fk_class_id;

        $verifyRules = $this->verifyRules($email, $fk_class_id);
        if($verifyRules){
            return response()->json([
                'message' => $verifyRules
            ], 202);
        }

        $user = User::where('email', $email)->first();

        $answer_head = AnswersHeadEvaluation::where('fk_user_id', $user->id)
            ->with('evaluationApplication')
            ->get();
        $can_delete = true;
        foreach ($answer_head as $head){
            if($head->evaluationApplication->fk_class_id == $fk_class_id){
                $can_delete = false;
                break ;
            }
        }

        if($can_delete == false){
            return response()->json([
                'message' => 'O estudante '.$user->name.', não pode ser excluído. O estudante possui simulados respondidos nesta turma.'
            ], 202);
        }

        $classStudents = ClassStudents::where('fk_class_id', $fk_class_id)
            ->where('fk_user_id', $user->id)->first();

        if(!$classStudents){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 202);
        }

        $classStudents->delete();

        return response()->json([
            'message' => 'Estudante '.$user->name.', excluído da turma com sucesso.',
            $classStudents
        ], 200);


    }

    private function verifyRules($email, $fk_class_id){

        if(!$email || !$fk_class_id ){
            return 'Informe o e-mail do estudante e a turma.';
        }

        $userLog = auth('api')->user(); //usuário ativo o sistema

        $class = ClassQuestione::where('id', $fk_class_id )->first();

        if(!$class){
            return 'Turma não encontrada.';
        }

        if($class->fk_user_id != $userLog->id){
            return 'Turma pertence a outro usuário.';
        }

        $user = User::where('email', $email)->first();

        if(!$user){
            return 'Estudante não encontrado.';
        }

        if($user->id == $userLog->id){
            return 'O usuário logado não pode ser adicionado/excluído na turma.';
        }

        if($user->acess_level == 1){
            return 'Usuário administrador não pode ser adicionado/excluído na turma.';
        }

        return null;
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
