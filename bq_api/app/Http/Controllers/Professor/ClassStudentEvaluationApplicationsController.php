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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        $description = $request->description;

        $evaliation_application = EvaluationApplication::where('fk_class_id',$idclass)
            ->when($description, function ($query) use ($description) {
                return $query->where('description', 'like','%'.$description.'%')
                            ->orWhere('id_application', $description);
            })
            ->where('id_application', '!=', '')
            ->with('evaluation')
            ->orderBy('id', 'DESC')
            ->get();

        return response()->json($evaliation_application, 200);
    }

}
