<?php

namespace App\Http\Controllers;

use App\AnswersHeadEvaluation;
use App\ClassQuestione;
use App\ClassStudents;
use App\Evaluation;
use App\EvaluationApplication;
use Illuminate\Http\Request;
use Validator;

class ClassEvaluationApplicationsStudentsStudent extends Controller
{
    public function index(Request $request, int $idclass)
    {
        $user = auth('api')->user();

        $class = ClassQuestione::where('id', $idclass)->first();

        if(!$class){
            return response()->json([
                'message' => 'A turma não foi encontrada.'
            ], 202);
        }

        $classStudent = ClassStudents::where('fk_user_id', $user->id)
            ->where('fk_class_id', $class->id)->first();

        if(!$classStudent){
            return response()->json([
                'message' => 'O usuário não pertence a turma.'
            ], 202);
        }

        $description = $request->description;

        $evaliation_application = EvaluationApplication::where('fk_class_id',$idclass)
            ->when($description, function ($query) use ($description) {
                return $query->where('description', 'like','%'.$description.'%')
                    ->orWhere('id_application', $description);
            })
            ->with('evaluation')
            ->orderBy('id', 'DESC')
            ->get();

        return response()->json($evaliation_application, 200);
    }

}
