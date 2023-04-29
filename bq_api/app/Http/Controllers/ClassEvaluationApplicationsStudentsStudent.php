<?php

namespace App\Http\Controllers;

use App\AnswersHeadEvaluation;
use App\ClassQuestione;
use App\ClassStudents;
use App\Evaluation;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
use App\AnswersEvaluation;
use App\Question;
use App\QuestionItem;
use Illuminate\Http\Request;
use Validator;

class ClassEvaluationApplicationsStudentsStudent extends Controller
{
    public function index(Request $request, int $idclass)
    {
        $user = auth('api')->user();

        $class = ClassQuestione::where('id', $idclass)->first();

        if(!$class){
            return response()->json([
                'message' => 'A turma não foi encontrada.'
            ], 202);
        }

        $classStudent = ClassStudents::where('fk_user_id', $user->id)
            ->where('fk_class_id', $class->id)->first();

        if(!$classStudent){
            return response()->json([
                'message' => 'O usuário não pertence a turma.'
            ], 202);
        }

        $description = $request->description;

        $evaliation_application = EvaluationApplication::where('fk_class_id',$idclass)
            ->with('evaluation')
            ->orderBy('id', 'DESC')
            ->get();

        $applications_result = array();
        foreach ($evaliation_application as $application) {
            $result = new \ArrayObject();

            $answer_head = AnswersHeadEvaluation::where('fk_application_evaluation_id', $application->id)
                ->where('fk_user_id', $user->id)
                ->first();

            $result = (object)[
                'application' => $application,
                'answer_head' => $answer_head,
            ];
            $applications_result[] = $result;
        }

        return response()->json($applications_result, 200);
    }

    public function overview(int $idclass){
        $user = auth('api')->user();


        $class = ClassQuestione::where('id', $idclass)->first();

        if(!$class){
            return response()->json([
                'message' => 'A turma não foi encontrada.'
            ], 202);
        }

        $student_class = ClassStudents::where('fk_class_id', $idclass)
            ->where('fk_user_id', $user->id)
            ->with('user')
            ->first();

        if(!$student_class){
            return response()->json([
                'message' => 'O usuário não está inscrito na turma.'
            ], 202);
        }

        $evaliation_application = EvaluationApplication::where('fk_class_id',$idclass)
            ->orderBy('id', 'ASC')
            ->get();

        $students = array();
        //foreach ($students_class as $student) {

        $resultsEvaluation = array();
        foreach ($evaliation_application as $e_application) {
            $evaluation_answer = new \ArrayObject();


            $answer_head = AnswersHeadEvaluation::where('fk_application_evaluation_id', $e_application->id)
                ->where('fk_user_id', $student_class->fk_user_id)
                ->first();

            $totalQuestionEvaluation = sizeof(EvaluationHasQuestions::where('fk_evaluation_id',
                $e_application->fk_evaluation_id)
                ->get());

            //o aluno não tem resposta pra a avaliação
            if(!$answer_head){
                $evaluation_answer = (object)[
                    'application_id' => $e_application->id,
                    'application_description' => $e_application->description,
                    'total_correct' => 0,
                    'total_questions_evaluation' => $totalQuestionEvaluation,
                    'porcentage_correct' => 0,
                    'created_at' => null,
                    'finalized_at' => null
                ];
                $resultsEvaluation[] = $evaluation_answer;
                continue;
            }

            //o aluno tem resposta para a avaliação
            $answers = AnswersEvaluation::where('fk_answers_head_id', $answer_head->id)
                ->get();

            $totalCorrect = 0;

            foreach ($answers as $ans){

                $answerOfStudent = $ans->answer;

                $evaluationHasquestion = EvaluationHasQuestions::where('id', $ans->fk_evaluation_question_id)
                    ->first();
                $question = Question::where('id', $evaluationHasquestion->fk_question_id)->first();
                $itemQuestionCorrect = QuestionItem::where('fk_question_id', $question->id)
                    ->where('correct_item', 1)->first();

                if($answerOfStudent == $itemQuestionCorrect->id){
                    $totalCorrect++;
                }

                $evaluation_answer = (object)[
                    'application_id' => $e_application->id,
                    'application_description' => $e_application->description,
                    'finalized_at' => $answer_head->finalized_at,
                    'total_correct' => $totalCorrect,
                    'total_questions_evaluation' => $totalQuestionEvaluation,
                    'porcentage_correct' => round(($totalCorrect/$totalQuestionEvaluation)*100, 2),
                    'created_at' => $answer_head->created_at,
                ];

            }
            $resultsEvaluation[] = $evaluation_answer;

        }
        $totalPorcentageCorrect = 0;
        foreach($resultsEvaluation as $result){
            $totalPorcentageCorrect += $result->porcentage_correct;
        }
        $resultStudent = (object)[
            'student' => $student_class->user,
            'evaluation_answer' => $resultsEvaluation,
            'total_porcentage_correct_all' => round($totalPorcentageCorrect/sizeof($evaliation_application),
                2),
        ];

        $students[] = $resultStudent;

        return response()->json($students, 200);
    }

}
