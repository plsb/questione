<?php

namespace App\Http\Controllers;

use App\Evaluation;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
use Illuminate\Http\Request;
use Validator;
use DB;

class EvaluationPracticeController extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth']);
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
        //retorna todas as avaliações do usuário ativo
        if(!$request->status){
            return response()->json([
                'message' => 'Informe o status: (1)Ativa ou (2)Arquivada.'
            ], 202);
        }
        $user = auth('api')->user();
        DB::enableQueryLog();

        //pesquisa por codigo ou descrição
        if($request->id_evaluation || $request->description){
            $evaluation = Evaluation::where('fk_user_id', '=', $user->id)
                ->where('status', $request->status)
                ->where('practice', 1)
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
                ->where('practice', 1)
                ->orderBy('created_at', 'desc')
                ->with('user')
                ->paginate(10);
        }

        $queries = DB::getQueryLog();

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

        $evaluation->status = 1;
        $evaluation->fk_user_id = $user->id;
        $evaluation->practice = 1;

        $evaluation->save();

        return response()->json([
            'message' => 'Avaliação cadastrada.',
            $evaluation
        ], 200);
    }

    public function show(int $id)
    {
        $evaluation = Evaluation::where('id', '=', $id)
            ->where('practice', 1)
            ->with('user')
            ->with('questions')
            ->get();
        if(sizeof($evaluation) == 0){
            return response()->json([
                'message' => 'Avaliação não encontrada.'
            ], 202);
        }

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
        $user = auth('api')->user();
        $evaluation = Evaluation::find($id);

        $this->verifyRecord($evaluation);

        if($evaluation->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Operação não pode ser realizada. A avaliação pertence a outro usuário.'
            ], 202);
        }

        $application = EvaluationApplication::where('fk_evaluation_id', '=', $id)->get();
        if(sizeof($application)>0) {
            return response()->json(['message' => 'Operação não realizada. Existem aplicações para esta avaliação.'], 202);
        }

        $evaluation->delete();

        return response()->json([
            'message' => 'Avaliação excluída.',
            $evaluation
        ], 200);
    }

    public function changeStatus($id, Request $request)
    {
        $user = auth('api')->user();
        $evaluation = Evaluation::find($id);

        if($evaluation->fk_user_id != $user->id){
            return response()->json([
                'message' => 'A avaliação pertence a outro usuário.'
            ], 202);
        }

        if(!$request->status){
            return response()->json([
                'message' => 'Informe o status: (1)Ativa ou (2)Arquivada.'
            ], 202);
        }
        $evaluation->status = $request->status;
        $evaluation->save();
        if($request->status == 2){

        }

        return response()->json([
            'message' => 'Avaliação arquivada.',
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
