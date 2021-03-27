<?php

namespace App\Http\Controllers\Practice;

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

    public function index(Request $request)
    {
        $user = auth('api')->user();

        $evaluations = Evaluation::where('fk_user_id', '=', $user->id)
            ->where('practice', 1)
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

}
