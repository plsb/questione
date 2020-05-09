<?php

namespace App\Http\Controllers;

use App\AnswersEvaluation;
use App\Course;
use App\Evaluation;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
use App\AnswersHeadEvaluation;
use App\Question;
use Illuminate\Http\Request;
use Validator;
use App\Http\Controllers\Controller;

class ResultEvaluationStudent extends Controller
{

    public function __construct()
    {
        $this->middleware(['jwt.auth']);
    }

    public function evaluations(Request $request){
        $user = auth('api')->user();

        $head_answer = AnswersHeadEvaluation::where('fk_user_id',$user->id)
            ->with('evaluationApplication')
            ->orderBy('created_at', 'DESC')
            ->paginate(10);

        if(sizeof($head_answer)==0){
            return response()->json([
                'message' => 'Não foram encottradas avaliações.',
                $user
            ], 202);
        }

        return response()->json($head_answer, 200);
    }

}
