<?php

namespace App\Http\Controllers\Professor;

use App\Evaluation;
use App\EvaluationHasQuestions;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;
use DB;

class EvaluationController extends Controller
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
        'description' => 'required|max:300|min:4',
    ];

    private $messages = [
        'description.required' => 'A DESCRIÇÃO é obrigatória.',
        'description.max' => 'O máximo de alfanuméricos aceitáveis para a DESCRIÇÃO é 300.',
        'description.min' => 'O minímo de alfanuméricos aceitáveis para a DESCRIÇÃO é 04.',
    ];

    public function index(Request $request)
    {
        //retorna todas as questões do usuário ativo
        if(!$request->status){
            return response()->json([
                'message' => 'Informe o status: (1)Ativa ou (2)Arquivada.'
            ], 202);
        }
        $user = auth('api')->user();
        DB::enableQueryLog();

        //pesquisa por codigo ou descrição
        //dd($request->id_evaluation);
        if($request->id_evaluation || $request->description){
            $evaluation = Evaluation::where('fk_user_id', '=', $user->id)
                ->where('status', $request->status)
                ->where(
                function ($query) use ($request) {
                    $query->where('description', 'like', $request->description ? '%'.$request->description.'%' : null);
                     })
                ->orderBy('created_at', 'desc')
                ->with('user')
                ->paginate(10);
        } else {
            $evaluation = Evaluation::where('fk_user_id', '=', $user->id)
                ->where('status', $request->status)
                ->orderBy('created_at', 'desc')
                ->with('user')
                ->paginate(10);
        }

        $queries = DB::getQueryLog();
        //dd($queries);

        return response()->json($evaluation, 200);
    }

    public function store(Request $request)
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

        $evaluation = new Evaluation();
        $evaluation->description = $request->description;

        //ano 		Horas/minutos/segundos e id PRofessor
       // $evaluation->id_evaluation = substr(date('Y'), -2)."".date('Gis')."".$user->id;
        $evaluation->status = 1;
        $evaluation->fk_user_id = $user->id;

        $evaluation->save();

        return response()->json([
            'message' => 'Avaliação cadastrada.',
            $evaluation
        ], 200);
    }

    public function show(int $id)
    {
        $evaluation = Evaluation::where('id', '=', $id)
            ->with('user')
            ->with('questions')
            ->get();

        $user = auth('api')->user();

        if($evaluation[0]->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Operação não pode ser realizada. A avaliação pertence a outro usuário.'
            ], 202);
        }

        $this->verifyRecord($evaluation);

        return response()->json($evaluation, 200);
    }

    public function update(Request $request, $id)
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
        $evaluation = Evaluation::find($id);

        if($evaluation->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Operação não pode ser realizada. A avaliação pertence a outro usuário.'
            ], 202);
        }

        $this->verifyRecord($evaluation);
        $evaluation->description = $request->description;

        $evaluation->save();


        return response()->json([
            'message' => 'Avaliação atualizada.',
            $evaluation
        ], 200);

    }

    public function destroy($id)
    {
        //verficar a necessidade
    }

    public function changeStatus($id, Request $request)
    {
        $user = auth('api')->user();
        $evaluation = Evaluation::find($id);

        if($evaluation->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Operação não pode ser realizada. A avaliação pertence a outro usuário.'
            ], 202);
        }

        if(!$request->status){
            return response()->json([
                'message' => 'Informe o status: (1)Ativa ou (2)Arquivada.'
            ], 202);
        }

        $evaluation->status = $request->status;
        $evaluation->save();

        return response()->json([
            'message' => 'Avaliação arquivada.',
            $evaluation
        ], 200);

    }

    public function duplicate($id, Request $request){
        $user = auth('api')->user();
        $evaluationDuplicate = Evaluation::find($id);
        $questionsDuplicate = EvaluationHasQuestions::where('fk_evaluation_id',
                    $evaluationDuplicate->id)->get();


        if($evaluationDuplicate->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Operação não pode ser realizada. A avaliação pertence a outro usuário.'
            ], 202);
        }

        $evaluation = new Evaluation();
        $evaluation->description = $evaluationDuplicate->description;

        $evaluation->status = 1; //status 1 é ativa
        $evaluation->fk_user_id = $user->id;

        $evaluation->save();

        //duplica questoes da avaliação
        foreach($questionsDuplicate as $question){
            $evaluation_question = new EvaluationHasQuestions();
            $evaluation_question->fk_question_id = $question->fk_question_id;
            $evaluation_question->fk_evaluation_id = $evaluation->id;
            $evaluation_question->save();
        }

        return response()->json([
            'message' => 'Avaliação cadastrada(duplciada).',
            $evaluation
        ], 200);
    }

    public function verifyRecord($record){
        if(!$record || $record == '[]'){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 202);
        }
    }

}
