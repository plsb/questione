<?php

namespace App\Http\Controllers\Professor;

use App\AnswersEvaluation;
use App\Course;
use App\Evaluation;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
use App\AnswersHeadEvaluation;
use App\KnowledgeObject;
use App\Question;
use App\QuestionHasKnowledgeObject;
use App\QuestionItem;
use App\Skill;
use App\User;
use App\ClassQuestione;
use App\ClassStudents;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpParser\Builder\Class_;
use Validator;
use App\Http\Controllers\Controller;
use function Sodium\add;

class ClassStudentEvaluationApplicationsController extends Controller
{

    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkProfessor']);
    }

    private $rules = [
        'fk_evaluation_id' => 'required',
        'description' => 'required|max:300|min:5',
    ];

    private $messages = [
        'fk_evaluation_id.required' => 'A AVALIAÇÃO é obrigatória.',

        'description.required' => 'A DESCRIÇÃO DA APLICAÇÃO é obrigatória.',
        'description.min' => 'A DESCRIÇÃO DA APLICAÇÃO tem que ter no mínimo 04 caracteres.',
        'description.max' => 'A DESCRIÇÃO DA APLICAÇÃO tem que ter no máximo 300 caracteres.',

    ];

    public function index(Request $request, int $idclass)
    {
        $user = auth('api')->user();

        $class = ClassQuestione::where('id', $idclass)->first();

        if(!$class){
            return response()->json([
                'message' => 'A turma não foi encontrada.'
            ], 202);
        }

        if($class->fk_user_id != $user->id){
            return response()->json([
                'message' => 'A turma pertence a outro usuário.'
            ], 202);
        }

        $description = $request->description;

        $evaliation_application = EvaluationApplication::where('fk_class_id',$idclass)
            ->when($description, function ($query) use ($description) {
                return $query->where('description', 'like','%'.$description.'%')
                            ->orWhere('id_application', $description);
            })
            ->with('evaluation')
            ->orderBy('id', 'DESC')
            ->get();

        return response()->json($evaliation_application, 200);
    }

    public function overview(int $idclass){
        $user = auth('api')->user();


        $class = ClassQuestione::where('id', $idclass)->first();

        if(!$class){
            return response()->json([
                'message' => 'A turma não foi encontrada.'
            ], 202);
        }

        if($class->fk_user_id != $user->id){
            return response()->json([
                'message' => 'A turma pertence a outro usuário.'
            ], 202);
        }

        $evaliation_application = EvaluationApplication::where('fk_class_id',$idclass)
            ->orderBy('id', 'DESC')
            ->get();

        $students_class = ClassStudents::where('fk_class_id', $class->id)
            ->with('user')
            ->get();

        $students = array();
        foreach ($students_class as $student) {

            $resultsEvaluation = array();
            foreach ($evaliation_application as $e_application) {
                $evaluation_answer = new \ArrayObject();


                $answer_head = AnswersHeadEvaluation::where('fk_application_evaluation_id', $e_application->id)
                        ->where('fk_user_id', $student->fk_user_id)
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
                'student' => $student->user,
                'evaluation_answer' => $resultsEvaluation,
                'total_porcentage_correct_all' => round($totalPorcentageCorrect/sizeof($evaliation_application),
                    2),
            ];

            $students[] = $resultStudent;
        }

        return response()->json($students, 200);
    }

}
