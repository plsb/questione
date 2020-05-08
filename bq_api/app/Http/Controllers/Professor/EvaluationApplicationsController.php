<?php

namespace App\Http\Controllers\Professor;

use App\Course;
use App\Evaluation;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
use App\Question;
use Illuminate\Http\Request;
use Validator;
use App\Http\Controllers\Controller;

class EvaluationApplicationsController extends Controller
{

    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkProfessor']);
    }

    private $rules = [
        'fk_evaluation_id' => 'required',
        'description' => 'required|max:300|min:4',
    ];

    private $messages = [
        'fk_evaluation_id.required' => 'A AVALIAÇÃO é obrigatória.',

        'description.required' => 'A DESCRIÇÃO DA APLICAÇÃO é obrigatória.',
        'description.min' => 'A DESCRIÇÃO DA APLICAÇÃO tem que ter no mínimo 04 caracteres.',
        'description.max' => 'A DESCRIÇÃO DA APLICAÇÃO tem que ter no máximo 300 caracteres.',

    ];

    public function index(Request $request)
    {
        $user = auth('api')->user();

        $evaluations = Evaluation::where('fk_user_id', '=', $user->id)
            ->get();

        $description = $request->description;

        $arr = array();
        foreach ($evaluations as $ev){
            //dd($enaq);
            $arr[] = $ev->id;
        }
        $evaliation_application = EvaluationApplication::whereIn('fk_evaluation_id',$arr)
            ->when($description, function ($query) use ($description) {
                return $query->where('description', 'like','%'.$description.'%');
            })
            ->with('evaluation')
            ->orderBy('id', 'DESC')
            ->paginate(10);

        return response()->json($evaliation_application, 200);
    }

    public function store(Request $request){

        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()) {
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        $evaluation = Evaluation::find($request->fk_evaluation_id);

        if(!$evaluation){
            return response()->json([
                'message' => 'Operação não permitida. A avaliação não foi encontrada.'
            ], 202);
        }

        $user = auth('api')->user();
        if($user->id != $evaluation->fk_user_id){
            return response()->json([
                'message' => 'Operação não permitida. A avaliação pertence a um outro usuário.'
            ], 202);
        }

        $evaluation_question = EvaluationHasQuestions::where('fk_evaluation_id', $evaluation->id)
                    ->get();

        if(sizeof($evaluation_question)==0){
            return response()->json([
                'message' => 'Operação não permitida. A avaliação não tem questões.'
            ], 202);
        }
        //dd($evaluation_question);

        do{
            //ano 		Horas/minutos/segundos e id PRofessor
            $token = bin2hex(random_bytes(1));
            $id_evaluation = mb_strtoupper(substr(date('Y'), -2)."".date('Gis')."".$token);
            $verifyApplication = EvaluationApplication::where('id_application',$id_evaluation)->get();
        } while(sizeof($verifyApplication)>0);

        $evaluation_application = new EvaluationApplication();
        $evaluation_application->id_application = $id_evaluation;
        $evaluation_application->description = $request->description;
        $evaluation_application->fk_evaluation_id = $request->fk_evaluation_id;
        $evaluation_application->status = 0;
        $evaluation_application->save();

        return response()->json([
            'message' => 'Aplicação da avaliação cadastrada.',
            $evaluation_application
        ], 200);

    }

    public function changeStatus(Request $request, $id){

        $evaluation_application = EvaluationApplication::find($id);

        if(!$evaluation_application){
            return response()->json([
                'message' => 'Operação não permitida. A aplicação da avaliação não foi encontrada.'
            ], 202);
        }

        $evaluation = Evaluation::where('id', $evaluation_application->fk_evaluation_id)->first();
        //dd($evaluation);
        $user = auth('api')->user();
        if($user->id != $evaluation->fk_user_id){
            return response()->json([
                'message' => 'Operação não permitida. A avaliação pertence a um outro usuário.'
            ], 202);
        }

        if($evaluation->status == 2){
            $evaluation_application->status = 0;
            $evaluation_application->save();
            return response()->json([
                'message' => 'Operação não permitida. A avaliação está arquivada.'
            ], 202);
        }

        $status = $evaluation_application->status;
        if($status == 0){
            $evaluation_application->status = 1;
        } else {
            $evaluation_application->status = 0;
        }
        $evaluation_application->save();

        $evaluation_application = EvaluationApplication::where('id', $evaluation_application->id)
            ->with('evaluation')->first();

        return response()->json([
            'message' => 'Status da aplicação da avaliação mudado.',
            $evaluation_application
        ], 200);

    }

}
