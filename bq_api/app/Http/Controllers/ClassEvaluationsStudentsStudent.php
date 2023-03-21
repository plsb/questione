<?php

namespace App\Http\Controllers;

use App\AnswersHeadEvaluation;
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

        $class_students_student = ClassStudents::where('fk_class_id',$idClass)
            ->first();

        if(!$class_students_student){
            return response()->json([
                'message' => 'Turma não encontrada.'
            ], 202);
        }

        $evaluations = Evaluation::where("fk_class_id", $class_students_student->fk_class_id)
            ->select('id')
            ->get();

        $applications = EvaluationApplication::whereIn("fk_evaluation_id", $evaluations)
            ->where('status', 1)
            ->get();

        if(sizeof($applications)==0){
            return response()->json([
                'message' => 'Avaliações não encontradas.'
            ], 202);
        }

        return response()->json($applications, 200);
    }

    public function evaluations(Request $request, $idClass){

        $user = auth('api')->user();

        $class_students_student = ClassStudents::where('fk_class_id',$idClass)
            ->first();

        if($class_students_student){
            if($class_students_student->fk_user_id != $user->id){
                return response()->json([
                    'message' => 'O usuário não pertence a turma.'
                ], 202);
            }
        } else {
            return response()->json([
                'message' => 'Turma não encontrada.'
            ], 202);
        }

        $evaluations = Evaluation::where("fk_class_id", $idClass)
            ->select('id')
            ->get();

        $applications = EvaluationApplication::whereIn("fk_evaluation_id", $evaluations)
            ->where('status', 1)
            ->select('id')
            ->get();

        if(sizeof($applications)==0){
            return response()->json([
                'message' => 'Avaliações não encontradas.'
            ], 202);
        }

        $head_answer = AnswersHeadEvaluation::where('fk_user_id',$user->id)
            ->whereIn("fk_application_evaluation_id", $applications)
            ->with('evaluationApplication')
            ->orderBy('created_at', 'DESC')
            ->paginate(10);

        if(sizeof($head_answer)==0){
            return response()->json([
                'message' => 'Nenhuma avaliação foi encontrada.',
                $user
            ], 202);
        }

        return response()->json($head_answer, 200);
    }

}
