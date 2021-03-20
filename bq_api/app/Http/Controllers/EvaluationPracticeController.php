<?php

namespace App\Http\Controllers;

use App\Course;
use App\Evaluation;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
use App\Question;
use App\TypeOfEvaluation;
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

    public function generateAutomaticEvaluation(Request $request, $id){
        $user = auth('api')->user();
        $evaluation = Evaluation::find($id);

        if($evaluation->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Operação não pode ser realizada. A avaliação pertence a outro usuário.'
            ], 202);
        }

        if(!$request->fk_type_evaluation_id){
            return response()->json([
                'message' => 'Informe o tipo da avaliação.'
            ], 202);
        }
        $typeEvaluation = TypeOfEvaluation::find($request->fk_type_evaluation_id);
        if(!$typeEvaluation){
            return response()->json([
                'message' => 'Tipo de avaliação não encontrado.'
            ], 202);
        }

        if(!$request->fk_course_id){
            return response()->json([
                'message' => 'Informe a área.'
            ], 202);
        }
        $course = Course::find($request->fk_course_id);
        if(!$course){
            return response()->json([
                'message' => 'Área não encontrada.'
            ], 202);
        }

        if(!$request->qtQuestions){
            return response()->json([
                'message' => 'Informe a quantidade de questões.'
            ], 202);
        }
        if(!is_int($request->qtQuestions)){
            return response()->json([
                'message' => 'A quantidade informada deve ser um número inteiro.'
            ], 202);
        }
        if($request->year_start && $request->year_end ){
            if($request->year_end < $request->year_start){
                return response()->json([
                    'message' => 'Ano final deve ser maior que o ano inicial.'
                ], 202);
            }
        }

        //colocar validação de quantidade de questões se tem ou não

        //aqui ocorrerá a geração de prova automática
    }

    public function hasQuestionsinEvaluation(Request $request, $id){

        $evaluationQuestions = EvaluationHasQuestions::where('fk_evaluation_id', $id)->get();

        return $evaluationQuestions;
    }

    public function showHowManyQuestions(Request $request){

        if(!$request->fk_type_evaluation_id){
            return response()->json([
                'message' => 'Informe o tipo da avaliação.'
            ], 202);
        }
        $typeEvaluation = TypeOfEvaluation::find($request->fk_type_evaluation_id);
        if(!$typeEvaluation){
            return response()->json([
                'message' => 'Tipo de avaliação não encontrado.'
            ], 202);
        }

        if(!$request->fk_course_id){
            return response()->json([
                'message' => 'Informe a área.'
            ], 202);
        }
        $course = Course::find($request->fk_course_id);
        if(!$course){
            return response()->json([
                'message' => 'Área não encontrada.'
            ], 202);
        }

        $year_start =  $request->year_start;
        $year_end =  $request->year_end;
        $questions = Question::where('fk_type_of_evaluation_id', '=', $typeEvaluation->id)
            ->where('fk_course_id', $course->id)
            ->when($year_start, function ($query, $year_start) {
                //pega questões validadas de todos os usuário
                return $query->where('year', '>=', $year_start);
            })
            ->when($year_end, function ($query, $year_end) {
                //pega questões validadas de todos os usuário
                return $query->where('year', '<=', $year_end);
            })->count();
        return response()->json($questions, 200);
    }

    public function verifyRecord($record){
        if(!$record || $record == '[]'){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 202);
        }
    }
}
