<?php

namespace App\Http\Controllers\Professor;

use App\AnswersEvaluation;
use App\Course;
use App\Evaluation;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
use App\AnswersHeadEvaluation;
use App\Http\Controllers\Adm\ProfileController;
use App\KnowledgeObject;
use App\Profile;
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

class EvaluationApplicationsController extends Controller
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
                return $query->where('description', 'like','%'.$description.'%')
                            ->orWhere('id_application', $description);
            })
            ->where('id_application', '!=', '')
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
                'message' => 'A avaliação não foi encontrada.'
            ], 202);
        }

        $user = auth('api')->user();
        if($user->id != $evaluation->fk_user_id){
            return response()->json([
                'message' => 'A avaliação pertence a um outro usuário.'
            ], 202);
        }

        $evaluation_question = EvaluationHasQuestions::where('fk_evaluation_id', $evaluation->id)
                    ->get();

        if(sizeof($evaluation_question)==0){
            return response()->json([
                'message' => 'A avaliação não tem questões.'
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

    public function update(Request $request, $id){

        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if(!$request->description) {
            return response()->json([
                'message' => 'Informe a descrição.'
            ], 200);
        }

        $evaluation_application = EvaluationApplication::find($id);

        if(!$evaluation_application){
            return response()->json([
                'message' => 'A aplicação da avaliação não foi encontrada.'
            ], 202);
        }

        $evaluation = Evaluation::where('id', $evaluation_application->fk_evaluation_id)->first();
        //dd($evaluation_application);
        $user = auth('api')->user();
        if($user->id != $evaluation->fk_user_id){
            return response()->json([
                'message' => 'A avaliação pertence a um outro usuário.'
            ], 202);
        }

        if($evaluation->status == 2){
            $evaluation_application->status = 0;
            $evaluation_application->save();
            return response()->json([
                'message' => 'A avaliação está arquivada.'
            ], 202);
        }

        $evaluation_application->description = $request->description;
        if($request->random_questions) {
            $evaluation_application->random_questions = $request->random_questions;
        } else {
            $evaluation_application->random_questions = false;
        }
        if($request->show_results) {
            $evaluation_application->show_results = $request->show_results;
        } else {
            $evaluation_application->show_results = false;
        }
        $evaluation_application->save();

        return response()->json([
            'message' => 'Aplicação da avaliação atualizada.',
            $evaluation_application
        ], 200);

    }

    public function changeStatus(Request $request, $id){

        $evaluation_application = EvaluationApplication::find($id);

        if(!$evaluation_application){
            return response()->json([
                'message' => 'A aplicação da avaliação não foi encontrada.'
            ], 202);
        }

        $evaluation = Evaluation::where('id', $evaluation_application->fk_evaluation_id)->first();
        //dd($evaluation);
        $user = auth('api')->user();
        if($user->id != $evaluation->fk_user_id){
            return response()->json([
                'message' => 'A avaliação pertence a um outro usuário.'
            ], 202);
        }

        if($evaluation->status == 2){
            $evaluation_application->status = 0;
            $evaluation_application->save();
            return response()->json([
                'message' => 'A avaliação está arquivada.'
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

    public function show(int $id)
    {
        $application = EvaluationApplication::where('id', '=', $id)
            ->first();

        if(!$application){
            return response()->json([
                'message' => 'Aplicação não encontrada.'
            ], 202);
        }

        $evaluation = Evaluation::where('id', $application->fk_evaluation_id)->first();

        $user = auth('api')->user();

        if($evaluation->fk_user_id != $user->id){
            return response()->json([
                'message' => 'A avaliação pertence a outro usuário.'
            ], 202);
        }

        return response()->json($application, 200);
    }

    public function resultAnswerStudents($idApplication){
        $application = EvaluationApplication::where('id', $idApplication)->first();

        if(!$application){
            return response()->json([
                'message' => 'Aplicação não encontrada.'
            ], 202);
        }

        $evaluation = Evaluation::where('id', $application->fk_evaluation_id)->first();

        if(!$evaluation){
            return response()->json([
                'message' => 'Avaliação não encontrada.'
            ], 202);
        }

        //verificar de quem é a avaliação
        $user = auth('api')->user();
        if($evaluation->fk_user_id != $user->id){
            return response()->json([
                'message' => 'A avaliação pertence a outro usuário.'
            ], 202);
        }

        $answerHead = AnswersHeadEvaluation::where('fk_application_evaluation_id', '=', $idApplication)
            ->orderBy('id')
            ->get();

        if(sizeof($answerHead)==0){
            return response()->json([
                'message' => 'Sem dados de aplicação.'
            ], 202);
        }
       // return response()->json($answers, 202);
        $result = array();
        foreach ($answerHead as $head) {
            $resultStudent = new \ArrayObject();

            $answers = AnswersEvaluation::where('fk_answers_head_id', $head->id)
                ->orderBy('id')
                ->get();

            $student = User::where('id',$head->fk_user_id)->first();

            $questions = array();
            $total_questions = 0;
            $count_corret_student = 0;
            foreach ($answers as $ans) {
                $total_questions++;

                $evaluation_question = EvaluationHasQuestions::where('id', $ans->fk_evaluation_question_id)
                    ->first();

                $question = Question::where('id', $evaluation_question->fk_question_id)->first();
                $itens_question = QuestionItem::where('fk_question_id', $question->id)
                    ->where('correct_item', 1)->first();
                //dd($itens_question->id);
                $correct = -1;
                if($ans->answer == null){
                    $correct = -1;
                } else if ($ans->answer == $itens_question->id) {
                    $correct = 1;
                    $count_corret_student++;
                } else {
                    $correct = 0;
                }
                $object = (object)[
                    'questionId' => $question->id,
                    'itemCorrect' => $itens_question->id,
                    'itemSelected' => $ans->answer,
                    'correct' => $correct,
                ];
                $questions[] = $object;
            }
            $percentage = ($count_corret_student*100)/$total_questions;

            $total_time_active = 'Avaliação não finalizada.';
            if($head->finalized_at != null){
                $dataFuturo = $head->finalized_at;
                $dataAtual = $head->created_at;

                $date_time  = new \DateTime($dataAtual);
                $diff       = $date_time->diff( new \DateTime($dataFuturo));

                if($diff->y > 0){
                    $total_time_active = $diff->y . ' ano(s), ' .$diff->m . ' dia(s), ' . $diff->h . ' hora(s) e ' . $diff->i . ' minuto(s)';
                } else if($diff->m > 0) {
                    $total_time_active = $diff->m . ' dia(s), ' . $diff->h . ' hora(s) e ' . $diff->i . ' minuto(s)';
                } else if($diff->h > 0){
                    $total_time_active = $diff->h . ' hora(s) e ' . $diff->i . ' minuto(s)';
                } else {
                    $total_time_active = $diff->i . ' minuto(s)';
                }

            }


            $resultStudent = (object)[
                'student' => $student->name,
                'hr_start' => $head->created_at,
                'hr_finished' => $head->finalized_at,
                'total_time' => $total_time_active,
                'questions' => $questions,
                't_question' => $total_questions,
                't_correct' => $count_corret_student,
                'percentage_correct' => number_format($percentage, 2),
            ];
            $result[] = $resultStudent;
        }
        usort(

            $result,

            function( $a, $b ) {

                if( $a->student == $b->student ) return 0;

                return ( ( $a->student < $b->student ) ? -1 : 1 );
            }
        );

        return response()->json($result, 200);
    }


    public function resultPercentageQuestions($idApplication){
        $application = EvaluationApplication::where('id', $idApplication)->first();

        if(!$application){
            return response()->json([
                'message' => 'Aplicação não encontrada.'
            ], 202);
        }

        $evaluation = Evaluation::where('id', $application->fk_evaluation_id)->first();

        if(!$evaluation){
            return response()->json([
                'message' => 'Avaliação não encontrada.'
            ], 202);
        }

        //verificar de quem é a avaliação
        $user = auth('api')->user();
        if($evaluation->fk_user_id != $user->id){
            return response()->json([
                'message' => 'A avaliação pertence a outro usuário.'
            ], 202);
        }

        $evaluation_question = EvaluationHasQuestions::where('fk_evaluation_id', $evaluation->id)
            ->orderBy('id')
            ->get();

        if(sizeof($evaluation_question)==0){
            return response()->json([
                'message' => 'Nenhuma questão foi encontrada.'
            ], 202);
        }

        $head_question = AnswersHeadEvaluation::where('fk_application_evaluation_id', $application->id)
            ->get();
        $arrHead = array();
        foreach ($head_question as $head){
            //dd($enaq);
            $arrHead[] = $head->id;
        }


        $result = array();
        $resultQuestions = array();


        foreach ($evaluation_question as $ev_question){
            $question = Question::where('id', $ev_question->fk_question_id)->first();
            //verifica qual o item correto
            $item_correct = QuestionItem::where('fk_question_id', $question->id)
                ->where('correct_item', 1)->first();
            //total de pessoas que responderam a questão
            $count_total_answer_question = AnswersEvaluation::where('fk_evaluation_question_id', $ev_question->id)
                ->whereIn('fk_answers_head_id', $arrHead)
                ->whereNotNull('answer')
                ->count();

            //pega todos os itens da questão
            $itens_question = QuestionItem::where('fk_question_id',$question->id)->get();

            //quantidade de pessoas que acertaram a questão
            $answer = AnswersEvaluation::where('fk_evaluation_question_id', $ev_question->id)
                ->whereIn('fk_answers_head_id', $arrHead)
                ->where('answer', $item_correct->id)
                ->count();

            //porcentagem de pessoas que acertam a questão
            $percentageCorrectQuestion = 0;
            if($count_total_answer_question != 0){
                $percentageCorrectQuestion = ($answer * 100)/$count_total_answer_question;
            }

            $resultItens = array();
            foreach($itens_question as $iq){
                //conta quantas pessoas responderam esse item
                $count_total_answer_item = AnswersEvaluation::where('fk_evaluation_question_id', $ev_question->id)
                    ->where('answer', $iq->id)
                    ->whereIn('fk_answers_head_id', $arrHead)
                    ->whereNotNull('answer')
                    ->count();

                //porcentagem de acerto do item
                $percentageAnswerItem = 0;
                if($count_total_answer_question != 0) {
                    $percentageAnswerItem = ($count_total_answer_item * 100) / $count_total_answer_question;
                }
                if($iq->id == $item_correct->id){
                    $auxItem= (object)[
                        'description' => $iq->description,
                        'total_answer_item' => $count_total_answer_item,
                        'percentage_answer' => number_format($percentageAnswerItem, 2),
                        'correct' => 1,
                    ];
                } else {
                    $auxItem= (object)[
                        'description' => $iq->description,
                        'total_answer_item' => $count_total_answer_item,
                        'percentage_answer' => number_format($percentageAnswerItem, 2),
                        'correct' => 0,
                    ];
                }

                $resultItens[] = $auxItem;
            }
            $skill = Skill::where('id', $question->fk_skill_id)->first();
            $course = Course::where('id', $question->fk_course_id)->first();
            $objectsHasQuestion = QuestionHasKnowledgeObject::where('fk_question_id', $question->id)->get();

            $resultObjects = array();
            foreach ($objectsHasQuestion as $ob_has){
                $obj = KnowledgeObject::where('id', $ob_has->fk_knowledge_object)->first();
                $auxObject= (object)[
                    'description' => $obj->description,
                ];
                $resultObjects[] = $auxObject;
            }
            $descSkill = null;
            if($skill){
                $descSkill = $skill->description;
            }

            $auxQuestion= (object)[
                'idQuestion' => $question->id,
                'cancel' => $ev_question->cancel,
                'base_text' => $question->base_text,
                'stem' => $question->stem,
                'reference' => $question->reference,
                'skill' => $descSkill,
                'course' => $course->description,
                'total_asnwer' => $count_total_answer_question,
                'percentage_correct' => number_format($percentageCorrectQuestion, 2),
                'percentage_correct_round' => round($percentageCorrectQuestion),
                'objects' => $resultObjects,
                'itens' => $resultItens,

            ];


            $resultQuestions[] = $auxQuestion;
        }

        //dd($evaluation_question);
        $auxEvaluation= (object)[
            'application' => $application->id,
            'idApplication' => $application->id_application,
            'description_application' => $application->description,
            'description_evaluation' => $evaluation->description,
            'questions' => $resultQuestions
        ];
        $result[] = $auxEvaluation;
        return response()->json($result, 200);
    }

    public function resultPercentageQuestionsBySkill($idApplication)
    {
        $application = EvaluationApplication::where('id', $idApplication)->first();

        if (!$application) {
            return response()->json([
                'message' => 'Aplicação não encontrada.'
            ], 202);
        }

        $evaluation = Evaluation::where('id', $application->fk_evaluation_id)->first();

        if (!$evaluation) {
            return response()->json([
                'message' => 'Avaliação não encontrada.'
            ], 202);
        }

        //verificar de quem é a avaliação
        $user = auth('api')->user();
        if ($evaluation->fk_user_id != $user->id) {
            return response()->json([
                'message' => 'A avaliação pertence a outro usuário.'
            ], 202);
        }

        $evaluation_question = EvaluationHasQuestions::where('fk_evaluation_id', $evaluation->id)->get();

        if (sizeof($evaluation_question) == 0) {
            return response()->json([
                'message' => 'Nenhuma questão foi encontrada.'
            ], 202);
        }

        $head_question = AnswersHeadEvaluation::where('fk_application_evaluation_id', $application->id)
            ->get();
        $arrHead = array();
        foreach ($head_question as $head){
            //dd($enaq);
            $arrHead[] = $head->id;
        }

        $result = array();
        $resultQuestions = array();

        $skillsQuestions = DB::select('select s.id from evaluations ev
                    inner join evaluation_questions eq on eq.fk_evaluation_id = ev.id
                    inner join questions q on q.id = eq.fk_question_id
                    inner join skills s on q.fk_skill_id = s.id
                    inner join courses c on c.id=q.fk_course_id
                    where ev.id=?
                    group by s.id
                    order by s.description', [$evaluation->id]);

        $resultSkills = array();
        $auxSkills = array();
        foreach ($skillsQuestions as $skill) {
            $total_questions = 0;
            $total_answer = 0;
            $total_answer_correct = 0;
            foreach ($evaluation_question as $ev_question) {
                $question = Question::where('id', $ev_question->fk_question_id)->first();
                if($question->fk_skill_id ) {
                    if($question->fk_skill_id == $skill->id){
                        $total_questions++;

                        //verifica qual o item correto
                        $item_correct = QuestionItem::where('fk_question_id', $question->id)
                            ->where('correct_item', 1)->first();
                        //total de pessoas que responderam a questão
                        $total_answer += AnswersEvaluation::where('fk_evaluation_question_id', $ev_question->id)
                            ->whereIn('fk_answers_head_id', $arrHead)
                            ->whereNotNull('answer')
                            ->count();

                        //quantidade de pessoas que acertaram a questão
                        $total_answer_correct += AnswersEvaluation::where('fk_evaluation_question_id', $ev_question->id)
                            ->whereIn('fk_answers_head_id', $arrHead)
                            ->where('answer', $item_correct->id)
                            ->count();

                    }
                }
            }
            $skillObject = Skill::where('id', $skill->id)->first();
            $course = Course::where('id', $skillObject->fk_course_id)->first();
            $percentage = 0;
            if($total_answer_correct>0 && $total_answer>0){
                $percentage = ($total_answer_correct*100)/$total_answer;
            }
            $auxSkills = (object)[
                'idSkill' => $skillObject->id,
                'description' => $skillObject->description,
                'course' => $course->description,
                'total_questions' => $total_questions,
                'total_answer' => $total_answer,
                'total_answer_correct' => $total_answer_correct,
                'percentage_correct' => number_format($percentage, 2),

            ];
            $resultSkills[] = $auxSkills;
        }

        return response()->json($resultSkills, 200);
    }

    public function resultPercentageQuestionsByObjects($idApplication)
    {
        $application = EvaluationApplication::where('id', $idApplication)->first();

        if (!$application) {
            return response()->json([
                'message' => 'Aplicação não encontrada.'
            ], 202);
        }

        $evaluation = Evaluation::where('id', $application->fk_evaluation_id)->first();

        if (!$evaluation) {
            return response()->json([
                'message' => 'Avaliação não encontrada.'
            ], 202);
        }

        //verificar de quem é a avaliação
        $user = auth('api')->user();
        if ($evaluation->fk_user_id != $user->id) {
            return response()->json([
                'message' => 'A avaliação pertence a outro usuário.'
            ], 202);
        }

        $evaluation_question = EvaluationHasQuestions::where('fk_evaluation_id', $evaluation->id)->get();

        if (sizeof($evaluation_question) == 0) {
            return response()->json([
                'message' => 'Nenhuma questão foi encontrada.'
            ], 202);
        }

        $head_question = AnswersHeadEvaluation::where('fk_application_evaluation_id', $application->id)
            ->get();
        $arrHead = array();
        foreach ($head_question as $head){
            //dd($enaq);
            $arrHead[] = $head->id;
        }

        $result = array();
        $resultQuestions = array();

        $objectsQuestions = DB::select('select ko.id from evaluations ev
                        inner join evaluation_questions eq on eq.fk_evaluation_id = ev.id
                        inner join questions q on q.id = eq.fk_question_id
                        inner join question_knowledge_objects qko on qko.fk_question_id = q.id
                        inner join knowledge_objects ko on ko.id = qko.fk_knowledge_object
                        inner join courses c on c.id=q.fk_course_id
                        where ev.id=?
                        group by ko.id
                        order by ko.description', [$evaluation->id]);

        $resultObjects = array();
        $auxObjects = array();
        foreach ($objectsQuestions as $obj) {
            $total_questions = 0;
            $total_answer = 0;
            $total_answer_correct = 0;
            foreach ($evaluation_question as $ev_question) {
                $question = Question::where('id', $ev_question->fk_question_id)->first();
                $knowloedgeObjectsQuestion = QuestionHasKnowledgeObject::where('fk_question_id', $question->id)
                    ->where('fk_knowledge_object', $obj->id)->first();
                if($knowloedgeObjectsQuestion) {

                    if ($knowloedgeObjectsQuestion->fk_knowledge_object == $obj->id) {
                        $total_questions++;

                        //verifica qual o item correto
                        $item_correct = QuestionItem::where('fk_question_id', $question->id)
                            ->where('correct_item', 1)->first();
                        //total de pessoas que responderam a questão
                        $total_answer += AnswersEvaluation::where('fk_evaluation_question_id', $ev_question->id)
                            ->whereIn('fk_answers_head_id', $arrHead)
                            ->whereNotNull('answer')
                            ->count();

                        //quantidade de pessoas que acertaram a questão
                        $total_answer_correct += AnswersEvaluation::where('fk_evaluation_question_id', $ev_question->id)
                            ->whereIn('fk_answers_head_id', $arrHead)
                            ->where('answer', $item_correct->id)
                            ->count();

                    }
                }
            }
            $objectObject = KnowledgeObject::where('id', $obj->id)->first();
            $course = Course::where('id', $objectObject->fk_course_id)->first();
            $percentage = 0;
            if($total_answer_correct>0 && $total_answer>0){
                $percentage = ($total_answer_correct*100)/$total_answer;
            }
            $auxObjects = (object)[
                'idObject' => $objectObject->id,
                'description' => $objectObject->description,
                'course' => $course->description,
                'total_questions' => $total_questions,
                'total_answer' => $total_answer,
                'total_answer_correct' => $total_answer_correct,
                'percentage_correct' => number_format($percentage, 2),

            ];
            $resultObjects[] = $auxObjects;
        }

        return response()->json($resultObjects, 200);
    }

}
