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

        $arrClass = array();
        foreach ($class_students_student as $class_s){
            //dd($enaq);
            $arrClass[] = $class_s->fk_class_id;
        }

        $arrEvaluations = array();
        $evaluations = Evaluation::whereIn("fk_class_id", $arrClass)->get();
        foreach ($evaluations as $evaluation_application_student){
            //dd($enaq);
            $arrEvaluations[] = $evaluation_application_student->id;
        }

        $applications = EvaluationApplication::whereIn("fk_evaluation_id", $arrEvaluations)->get();

        return response()->json($applications, 200);
    }

}
