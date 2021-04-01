<?php

namespace App\Http\Controllers\Practice;

use App\AnswersHeadEvaluation;
use App\Evaluation;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
use Illuminate\Http\Request;
use Validator;
use App\Http\Controllers\Controller;

class EvaluationApplicationsPracticeController extends Controller
{

    public function __construct()
    {
        $this->middleware(['jwt.auth']);
    }

    private $rules = [
        //'fk_evaluation_id' => 'required',
        'description' => 'required|max:300|min:5',
    ];

    private $messages = [
        //'fk_evaluation_id.required' => 'A AVALIAÇÃO é obrigatória.',

        'description.required' => 'A DESCRIÇÃO DA APLICAÇÃO é obrigatória.',
        'description.min' => 'A DESCRIÇÃO DA APLICAÇÃO tem que ter no mínimo 04 caracteres.',
        'description.max' => 'A DESCRIÇÃO DA APLICAÇÃO tem que ter no máximo 300 caracteres.',

    ];

    public function index(Request $request, $id)
    {
        $user = auth('api')->user();

        $evaluations = Evaluation::where('fk_user_id', '=', $user->id)
            ->where('practice', 1)
            ->where('id', $id)
            ->get();

        $description = $request->description;

        $arr = array();
        foreach ($evaluations as $ev){
            //dd($enaq);
            $arr[] = $ev->id;
        }
        $evaliation_application = EvaluationApplication::whereIn('fk_evaluation_id',$arr)
            ->when($description, function ($query) use ($description) {
                return $query->where('description', 'like','%'.$description.'%')
                    ->orWhere('id_application', $description);
            })
            ->where('id_application', '!=', '')
            ->with('evaluation')
            ->orderBy('id', 'DESC')
            ->paginate(10);

        return response()->json($evaliation_application, 200);
    }

    public function store(Request $request, $id){

        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()) {
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        $evaluation = Evaluation::find($id);

        if(!$evaluation){
            return response()->json([
                'message' => 'A avaliação não foi encontrada.'
            ], 202);
        }

        $user = auth('api')->user();
        if($user->id != $evaluation->fk_user_id){
            return response()->json([
                'message' => 'A avaliação pertence a um outro usuário.'
            ], 202);
        }

        $evaluation_question = EvaluationHasQuestions::where('fk_evaluation_id', $id)
                    ->get();

        if(sizeof($evaluation_question)==0){
            return response()->json([
                'message' => 'A avaliação não tem questões.'
            ], 202);
        }

        do{
            //ano 		Horas/minutos/segundos e id Professor
            $token = bin2hex(random_bytes(1));
            $id_evaluation = mb_strtoupper(substr(date('Y'), -2)."".date('Gis')."".$token);
            $verifyApplication = EvaluationApplication::where('id_application',$id_evaluation)->get();
        } while(sizeof($verifyApplication)>0);

        $evaluation_application = new EvaluationApplication();
        $evaluation_application->id_application = $id_evaluation;
        $evaluation_application->description = $request->description;
        $evaluation_application->fk_evaluation_id = $id;
        $evaluation_application->status = 1; //sempre será 1
        $evaluation_application->show_results = 1; //sempre será 1
        $evaluation_application->save();

        return response()->json([
            'message' => 'Aplicação da avaliação cadastrada.',
            $evaluation_application
        ], 200);

    }

    public function update(Request $request, $id){

        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if(!$request->description) {
            return response()->json([
                'message' => 'Informe a descrição.'
            ], 200);
        }

        $evaluation_application = EvaluationApplication::find($id);

        if(!$evaluation_application){
            return response()->json([
                'message' => 'A aplicação da avaliação não foi encontrada.'
            ], 202);
        }

        $evaluation = Evaluation::where('id', $evaluation_application->fk_evaluation_id)->first();
        //dd($evaluation_application);
        $user = auth('api')->user();
        if($user->id != $evaluation->fk_user_id){
            return response()->json([
                'message' => 'A avaliação pertence a um outro usuário.'
            ], 202);
        }

        if($evaluation->status == 2){
            $evaluation_application->status = 0;
            $evaluation_application->save();
            return response()->json([
                'message' => 'A avaliação está arquivada.'
            ], 202);
        }

        $evaluation_application->description = $request->description;
        $evaluation_application->save();

        return response()->json([
            'message' => 'Aplicação da avaliação atualizada.',
            $evaluation_application
        ], 200);

    }

    public function show(int $id)
    {
        $application = EvaluationApplication::where('id', '=', $id)
            ->first();

        if(!$application){
            return response()->json([
                'message' => 'Aplicação não encontrada.'
            ], 202);
        }

        $evaluation = Evaluation::where('id', $application->fk_evaluation_id)->first();

        $user = auth('api')->user();

        if($evaluation->fk_user_id != $user->id){
            return response()->json([
                'message' => 'A avaliação pertence a outro usuário.'
            ], 202);
        }

        return response()->json($application, 200);
    }

    public function statusApplication(int $id){
        /*
         * STATUS
         * 1- NÃO INICIADA
         * 2- INICIADA
         * 3- FINALIZADA
         */
        $application = EvaluationApplication::where('id', '=', $id)
            ->first();

        if(!$application){
            return response()->json([
                'message' => 'Aplicação não encontrada.'
            ], 202);
        }

        $evaluation = Evaluation::where('id', $application->fk_evaluation_id)->first();

        $user = auth('api')->user();

        if($evaluation->fk_user_id != $user->id){
            return response()->json([
                'message' => 'A avaliação pertence a outro usuário.'
            ], 202);
        }

        $answer_head = AnswersHeadEvaluation::where('fk_application_evaluation_id', $application->id)
            ->first();

        $status = 1; // NÃO INICIADA

        if($answer_head){
            $status = 2; // INICIADA
            if($answer_head->finalized_at){
                $status = 3; // FINALIZADA
            }
        }

        return response()->json($status, 200);
    }

}
