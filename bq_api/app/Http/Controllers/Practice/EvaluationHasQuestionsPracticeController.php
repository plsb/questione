<?php

namespace App\Http\Controllers\Practice;


use App\Course;
use App\Evaluation;
use App\EvaluationHasQuestions;
use App\Question;
use App\TypeOfEvaluation;
use Illuminate\Http\Request;
use Validator;
use App\Http\Controllers\Controller;

class EvaluationHasQuestionsPracticeController extends Controller
{

    public function __construct()
    {
        $this->middleware(['jwt.auth']);
    }

    public function generateAutomaticQuestionsOfEvaluation(Request $request, $id){
        $user = auth('api')->user();
        $evaluation = Evaluation::find($id);

        if($evaluation->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Operação não pode ser realizada. A avaliação pertence a outro usuário.'
            ], 202);
        }

        $verifyQuestions = EvaluationHasQuestions::where('fk_evaluation_id', $evaluation->id)->get();
        if($verifyQuestions->count() > 0){
            return response()->json([
                'message' => 'Já existe questões para essa avaliação.'
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

        //aqui ocorre a geração de prova automática
        $year_start = $request->year_start;
        $year_end = $request->year_end;
        $qtdQuestions = $request->qtQuestions;
        $fk_skill_id = $request->fk_skill_id;
        $questions = Question::where('fk_type_of_evaluation_id', '=', $typeEvaluation->id)
            ->where('fk_course_id', $course->id)
            ->whereNotNull('fk_skill_id')
            ->when($fk_skill_id, function ($query, $fk_skill_id) {
                //pega questões validadas de todos os usuário
                return $query->where('fk_skill_id', '=', $fk_skill_id);
            })
            ->when($year_start, function ($query, $year_start) {
                //pega questões validadas de todos os usuário
                return $query->where('year', '>=', $year_start);
            })
            ->when($year_end, function ($query, $year_end) {
                //pega questões validadas de todos os usuário
                return $query->where('year', '<=', $year_end);
            })->pluck('id');

        if($questions->count() < $qtdQuestions){
            if($qtdQuestions == 1){
                return response()->json([
                    'message' => 'Não há questões suficientes para gerar uma avaliação com ' . $qtdQuestions . ' questão'
                ], 202);
            } else {
                return response()->json([
                    'message' => 'Não há questões suficientes para gerar uma avaliação com ' . $qtdQuestions . ' questões'
                ], 202);
            }
        }

        //pega de forma aleatória. Futuramente deverá ser adicionado aprendizagem de máquina
        $arr_questions = $questions->toArray(); // retorna todas as questões elegíveis
        //pega a quantidade de questões informadas pelo usuário
        if($qtdQuestions <= 1){
            $output_rand[0] = array_rand($arr_questions, $qtdQuestions);
        } else {
            $output_rand = array_rand($arr_questions, $qtdQuestions);
        }
        //dd($output_rand, $qtdQuestions);
        foreach($output_rand as $o){
            $evaluation_question = new EvaluationHasQuestions();
            $evaluation_question->fk_question_id = $arr_questions[$o];
            $evaluation_question->fk_evaluation_id = $evaluation->id;
            $evaluation_question->save();
        }

        return response()->json($evaluation, 200);
    }


}
