<?php

namespace App\Http\Controllers;

use App\ClassQuestione;
use App\ClassStudents;
use App\Evaluation;
use App\EvaluationApplication;
use Illuminate\Http\Request;
use Validator;

class ClassEvaluationsStudentsStudent extends Controller
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

    public function index(Request $request, $idClass)
    {
        $user = auth('api')->user();

        $class_students_student = ClassStudents::where('fk_user_id',$user->id)
            ->get();

        if(sizeof($class_students_student)==0){
            return response()->json([
                'message' => 'O usuário não possui turmas.'
            ], 202);
        }

        $classStudentSelected = null;
        foreach ($class_students_student as $class_s){
            //dd($enaq);
            if($idClass == $class_s->fk_class_id){
                $classStudentSelected = $class_s;
            }
        }

        if(!$classStudentSelected){
            return response()->json([
                'message' => 'Turma não encontrada.'
            ], 202);
        }

        $arrEvaluations = array();
        $evaluations = Evaluation::where("fk_class_id", $classStudentSelected->fk_class_id)->get();
        foreach ($evaluations as $evaluation_application_student){
            //dd($enaq);
            $arrEvaluations[] = $evaluation_application_student->id;
        }

        $applications = EvaluationApplication::whereIn("fk_evaluation_id", $arrEvaluations)->get();

        if(sizeof($applications)==0){
            return response()->json([
                'message' => 'Avaliações não encontradas.'
            ], 202);
        }

        return response()->json($applications, 200);
    }

}
