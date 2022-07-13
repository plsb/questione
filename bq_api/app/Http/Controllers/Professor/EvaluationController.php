<?php

namespace App\Http\Controllers\Professor;

use App\Evaluation;
use App\EvaluationApplication;
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
        //retorna todas as avaliações do usuário ativo
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
                ->where('practice', 0)
                ->whereIsNull('fk_class_id')
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
                ->where('practice', 0)
                ->whereIsNull('fk_class_id')
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

        $evaluation->status = 1;
        $evaluation->fk_user_id = $user->id;
        $evaluation->practice = 0;

        $evaluation->save();

        return response()->json([
            'message' => 'Avaliação cadastrada.',
            $evaluation
        ], 200);
    }

    public function show(int $id)
    {
        $evaluation = Evaluation::where('id', '=', $id)
            ->where('practice', 0)
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

    public function showQuestions(int $id)
    {
        $evaluation = Evaluation::where('id', '=', $id)
            ->where('practice', 0)
            ->first();
        if(!$evaluation){
            return response()->json([
                'message' => 'Avaliação não encontrada.'
            ], 202);
        }

        $user = auth('api')->user();

        if($evaluation->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Operação não pode ser realizada. A avaliação pertence a outro usuário.'
            ], 202);
        }

        $application = EvaluationApplication::where('fk_evaluation_id', '=', $evaluation->id)->get();
        $has_application = 0;
        if(sizeof($application)>0) {
            $has_application = 1;
        }

        $evaluation_questions = EvaluationHasQuestions::where('fk_evaluation_id', $evaluation->id)
            ->with('question')
            ->get();

        $result = (object)[
            'evaluation' => $evaluation,
            'has_application' => $has_application,
            'evaluation_questions' => $evaluation_questions,
        ];

        return response()->json($result, 200);
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
        $evaluation->description = $evaluationDuplicate->description . ' (Cópia)';

        $evaluation->status = 1; //status 1 é ativa
        $evaluation->fk_user_id = $user->id;
        //dd($questionsDuplicate);
        $evaluation->save();

        //duplica questoes da avaliação
        foreach($questionsDuplicate as $question){
            $evaluation_question = new EvaluationHasQuestions();
            $evaluation_question->fk_question_id = $question->fk_question_id;
            $evaluation_question->fk_evaluation_id = $evaluation->id;
            $evaluation_question->save();
        }

        return response()->json([
            'message' => 'Avaliação cadastrada (duplicada).',
            $evaluation
        ], 200);
    }

    //função que retorna as avaliações que podem ser adicionadas questões
    public function evaluationsToChoose()
    {
        $user = auth('api')->user();

        //pega as avaliações que não podem ser inseridas questões
        $evaluations_not_add_questions = DB::table('evaluations')
            ->join('evaluation_application', 'evaluations.id', '=', 'evaluation_application.fk_evaluation_id')
            ->where('evaluations.fk_user_id', $user->id)
            ->where('evaluations.status', 1)
            ->select('evaluations.id')->get();
        $arr = array();
        foreach ($evaluations_not_add_questions as $enaq){
            //dd($enaq);
            $arr[] = $enaq->id;
        }
        //pega asvaliaçõesque podem ser inseridas questões
        $evaluations = Evaluation::where('evaluations.fk_user_id', $user->id)
            ->where('evaluations.status', 1)
            ->whereNotIn('id', $arr)
            ->orderBy('created_at', 'desc')
            ->with('class')
            ->get();

        return response()->json($evaluations, 200);
    }

    public function verifyRecord($record){
        if(!$record || $record == '[]'){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 202);
        }
    }

}
