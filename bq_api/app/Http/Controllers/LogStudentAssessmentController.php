<?php

namespace App\Http\Controllers;

use App\AnswersHeadEvaluation;
use App\DifficultyQuestion;
use App\Evaluation;
use App\EvaluationApplication;
use App\LogStudenAssessment;
use App\Question;
use Illuminate\Http\Request;
use Validator;
use DB;

class LogStudentAssessmentController extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth']);
    }

    private $rules = [
        'type' => 'required',
    ];

    private $messages = [
        'type.required' => 'O Tipo é obrigatória.',

    ];

    public function store(Request $request, $idApplication)
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

        $application = EvaluationApplication::where('id_application', $idApplication)->first();

        if(!$application){
            return response()->json([
                'message' => 'A Aplicação não foi encontrada.'
            ], 202);
        }

        $answer_head = AnswersHeadEvaluation::where('fk_user_id', $user->id)
            ->where('fk_application_evaluation_id', $application->id)
            ->first();

        if(!$answer_head){
            return response()->json([
                'message' => 'Simulado não encontrado.'
            ], 202);
        }

        if($user->id != $answer_head->fk_user_id){
            return response()->json([
                'message' => 'Simulado pertence a outro usuário.'
            ], 202);
        }


        $log = new LogStudenAssessment();
        $log->type = $request->type;
        $log->fk_anwers_head_id = $answer_head->fk_anwers_head_id;
        $log->save();

        return response()->json([
            'message' => 'Log cadastrado.',
            $log
        ], 200);
    }

}
