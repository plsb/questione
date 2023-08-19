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
        'fk_class_id' => 'required',
    ];

    private $messages = [
        'fk_evaluation_id.required' => 'A AVALIAÇÃO é obrigatória.',

        'fk_class_id.required' => 'A TURMA DA APLICAÇÃO é obrigatória.',

        'description.required' => 'A DESCRIÇÃO DA APLICAÇÃO é obrigatória.',
        'description.min' => 'A DESCRIÇÃO DA APLICAÇÃO tem que ter no mínimo 04 caracteres.',
        'description.max' => 'A DESCRIÇÃO DA APLICAÇÃO tem que ter no máximo 300 caracteres.',

    ];

    public function index(Request $request)
    {
        $user = auth('api')->user();

        $evaluations = Evaluation::where('fk_user_id', '=', $user->id)
            ->where('practice', 0)
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
            ->with('class')
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

        $class = ClassQuestione::find($request->fk_class_id);
        if(!$class){
            return response()->json([
                'message' => 'A turma não foi encontrada.'
            ], 202);
        }
        if($user->id != $class->fk_user_id){
            return response()->json([
                'message' => 'A turma pertence a um outro usuário.'
            ], 202);
        }
        if($class->status == 2){
            return response()->json([
                'message' => 'A turma está arquivada.'
            ], 202);
        }


        $evaluation_question = EvaluationHasQuestions::where('fk_evaluation_id', $evaluation->id)
                    ->get();

        if(sizeof($evaluation_question)==0){
            return response()->json([
                'message' => 'A avaliação não tem questões.'
            ], 202);
        }

        do{
            //ano 		Horas/minutos/segundos e id PRofessor
            $token = bin2hex(random_bytes(1));
            $id_evaluation = mb_strtoupper(substr(date('Y'), -2)."".date('Gis')."".$token);
            $verifyApplication = EvaluationApplication::where('id_application',$id_evaluation)->get();
        } while(sizeof($verifyApplication)>0);

        //verifica se as horas iniciais ou finais foram informadas e se a data inicial não é menor que a atual
        if($request->date_start){
            if($request->date_start < date('Y-m-d')){
                return response()->json([
                    'message' => 'A data para iniciar a avaliação deve ser maior ou igual a data atual.'
                ], 202);
            }
            if(!$request->time_start){
                return response()->json([
                    'message' => 'A hora para iniciar a prova deve ser informada.'
                ], 202);
            }
        }
        if($request->date_finish){
            if(!$request->time_finish){
                return response()->json([
                    'message' => 'A hora para finalizar a prova deve ser informada.'
                ], 202);
            }
        }
        //verifica se foi informado a data final e o tempo para finalizar. Os dois não podem ser informados ao mesmo tempo
        if($request->date_finish && $request->time_to_finalize){
            return response()->json([
                'message' => 'Deverá ser informado um tempo para finalizar a prova ou uma data para finalizar. '.
                'Os dois campos não podem ser informados para uma mesma aplicação'
            ], 202);
        }
        //verifica se a data final não é menor que a data e hora inicial.
        if($request->date_start && $request->date_finish){
            if($request->date_finish < $request->date_start){
                return response()->json([
                    'message' => 'A data para finalizar a prova não pode ser menor que a data para iniciar.'
                ], 202);
            }
            //verifica se as datas são iguais
            if($request->date_finish == $request->date_start){
                if($request->time_start && $request->time_finish){
                    if($request->time_finish <= $request->time_start){
                        return response()->json([
                            'message' => 'A hora para finalizar a prova não pode ser menor que a hora para iniciar.'
                        ], 202);
                    }
                }
            }
        }

        $evaluation_application = new EvaluationApplication();
        $evaluation_application->id_application = $id_evaluation;
        $evaluation_application->description = $request->description;
        $evaluation_application->fk_evaluation_id = $request->fk_evaluation_id;
        $evaluation_application->date_start = $request->date_start;
        $evaluation_application->time_start = $request->time_start;
        $evaluation_application->time_to_finalize = $request->time_to_finalize;
        $evaluation_application->date_finish = $request->date_finish;
        $evaluation_application->time_finish = $request->time_finish;
        $evaluation_application->fk_class_id = $request->fk_class_id;
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

        //verifica se as horas iniciais ou finais foram informadas e se a data inicial não é menor que a atual
        if($request->date_start){
            if($request->date_start < date('Y-m-d')){
                return response()->json([
                    'message' => 'A data para iniciar a avaliação deve ser maior ou igual a data atual.'
                ], 202);
            }
            if(!$request->time_start){
                return response()->json([
                    'message' => 'A hora para iniciar a prova deve ser informada.'
                ], 202);
            }
        }
        if($request->date_finish){
            if(!$request->time_finish){
                return response()->json([
                    'message' => 'A hora para finalizar a prova deve ser informada.'
                ], 202);
            }
        }
        //verifica se foi informado a data final e o tempo para finalizar. Os dois não podem ser informados ao mesmo tempo
        if($request->date_finish && $request->time_to_finalize){
            return response()->json([
                'message' => 'Deverá ser informado um tempo para finalizar a prova ou uma data para finalizar. '.
                    'Os dois campos não podem ser informados para uma mesma aplicação'
            ], 202);
        }
        //verifica se a data final não é menor que a data e hora inicial.
        if($request->date_start && $request->date_finish){
            if($request->date_finish < $request->date_start){
                return response()->json([
                    'message' => 'A data para finalizar a prova não pode ser menor que a data para iniciar.'
                ], 202);
            }
            //verifica se as datas são iguais
            if($request->date_finish == $request->date_start){
                if($request->time_start && $request->time_finish){
                    if($request->time_finish <= $request->time_start){
                        return response()->json([
                            'message' => 'A hora para finalizar a prova não pode ser menor que a hora para iniciar.'
                        ], 202);
                    }
                }
            }
        }

        $evaluation_application->description = $request->description;
        if($request->random_questions) {
            $evaluation_application->random_questions = $request->random_questions;
        } else {
            $evaluation_application->random_questions = 0;
        }
        //liberar resultado
        if($request->show_results) {
            $evaluation_application->show_results = $request->show_results;
            if(!($request->date_release_results && $request->time_release_results)){
                return response()->json([
                    'message' => 'Deve ser informada a data e a hora para liberação dos resultados da avaliação.'
                ], 202);
            } else {
                if($request->date_release_results < date('Y-m-d')){
                    return response()->json([
                        'message' => 'A data para liberar os resultados da avaliação deve ser maior ou igual a data atual.'
                    ], 202);
                } /*else if($request->date_release_results == date('Y-m-d')){
                    if($request->time_release_results <= date('H:i')){
                        return response()->json([
                            'message' => 'A hora para liberar os resultados da avaliação deve ser maior que a hora atual.'
                        ], 202);
                    }
                }*/
                //verifica a data e hora inicial da avaliação. A liberação dos resultados deve acontecer após essa data e hora
                if($request->date_start){
                    if($request->date_start > $request->date_release_results){
                        return response()->json([
                            'message' => 'A data para liberar os resultados da avaliação deve ser maior ou igual a data de início da avaliação.'
                        ], 202);
                    } else if($request->date_start == $request->date_release_results){
                        if($request->time_start >= $request->time_release_results){
                            return response()->json([
                                'message' => 'A hora para liberar os resultados da avaliação deve ser maior que a hora de início da avaliação.'
                            ], 202);
                        }
                    }
                }
                //verifica a data e hora final da avaliação. A liberação dos resultados deve acontecer após essa data e hora
                if($request->date_finish){
                    if($request->date_finish > $request->date_release_results){
                        return response()->json([
                            'message' => 'A data para liberar os resultados da avaliação deve ser maior ou igual a data de encerramento da avaliação.'
                        ], 202);
                    } else if($request->date_finish == $request->date_release_results){
                        if($request->time_finish >= $request->time_release_results){
                            return response()->json([
                                'message' => 'A hora para liberar os resultados da avaliação deve ser maior que a hora de encerramento da avaliação.'
                            ], 202);
                        }
                    }
                }

            }

            $evaluation_application->date_release_results = $request->date_release_results;
            $evaluation_application->time_release_results = $request->time_release_results;
            if($request->release_preview_question){
                $evaluation_application->release_preview_question = $request->release_preview_question;
            } else {
                $evaluation_application->release_preview_question = 0;
            }

        } else {
            $evaluation_application->date_release_results = null;
            $evaluation_application->time_release_results = null;
            $evaluation_application->show_results = 0;
            $evaluation_application->release_preview_question = 0;
        }
        $evaluation_application->date_start = $request->date_start;
        $evaluation_application->time_start = $request->time_start;
        $evaluation_application->time_to_finalize = $request->time_to_finalize;
        $evaluation_application->date_finish = $request->date_finish;
        $evaluation_application->time_finish = $request->time_finish;
        $evaluation_application->public_results = $request->public_results;
        if($evaluation_application->public_results == 1){
            $evaluation_application->can_see_students = $request->can_see_students;
        } else {
            $evaluation_application->can_see_students = 0;
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
                'message' => 'A Aplicação não foi encontrada.'
            ], 202);
        }

        $evaluation = Evaluation::where('id', $application->fk_evaluation_id)->first();

        if(!$evaluation){
            return response()->json([
                'message' => 'A Avaliação não foi encontrada.'
            ], 202);
        }

        //verificar de quem é a avaliação
        $user = auth('api')->user();

        if($user->acess_level == 0){ // verifica se é um aluno que está tentando acessar
            return response()->json([
                'message' => 'Os resultados da avaliação não podem ser apresentados.'
            ], 202);
        }
        if($application->public_results == 0){ //verifica se os resultados são públicos
            if($evaluation->fk_user_id != $user->id){ //se os resultados não forem públicos, verifica se o usuário que tenta acessar é o dono
                return response()->json([
                    'message' => 'Os resultados da avaliação não podem ser apresentados.'
                ], 202);
            }
        }

        //finaliza as avaliações de forma automática caso tenha passado o tempo para respondê-la
        //verifica se a avaliação tem tempo pré-determinado para terminar e finaliza automaticamente
        if($application->time_to_finalize){
            //pega o time e divide em horas, minutos e segundos
            $horas = substr($application->time_to_finalize, 0, 2);
            $minutos = substr($application->time_to_finalize, 3, 2);
            $segundos = substr($application->time_to_finalize, 6, 2);
            //pesquisa os cabeçalhos quee não possuem hora de finalização
            $answerHeadNotEnded = AnswersHeadEvaluation::where('fk_application_evaluation_id', '=', $idApplication)
                ->whereNull('finalized_at')
                ->orderBy('id')
                ->get();
            //percorre todas as avaliações que não possuem data de finalização
            foreach($answerHeadNotEnded as $ans_while){
                //pega o horário que a avaliação foi criada e acrescenta a ela o tempo para finalizar definido pelo professor
                $timeStudentShouldFinishedEvaluation = $ans_while->created_at;
                $timeStudentShouldFinishedEvaluation->add(new \DateInterval('PT'.$horas.'H'.$minutos.'M'.$segundos.'S'));
                $dateNow = new \DateTime(date('Y-m-d H:i'));
                if($timeStudentShouldFinishedEvaluation < $dateNow){

                    $ans_while->finalized_at = date('Y-m-d H:i:s');
                    $ans_while->finished_automatically = 1;
                    $ans_while->save();
                }
            }
        } else { //verifica se a avaliação tem uma data e uma hora de encerramento
            if($application->date_finish){ //verifica se existe date_finish
                //verifica se a data de finalizar é menor que a atual
                if($application->date_finish <= date('Y-m-d')){
                    //verifica se existe hora para terminar
                    if($application->time_finish){
                        //$timeFinish = new \DateTime($application->time_finish); // converte a hora em DateTime
                        //verifica se a hora já passou
                        $hour = date('H:i');
                        if($application->time_finish < $hour){

                            $answerHeadNotEnded = AnswersHeadEvaluation::where('fk_application_evaluation_id', '=', $idApplication)
                                ->whereNull('finalized_at')
                                ->orderBy('id')
                                ->get();
                            //percorre todas as avaliações que não possuem data de finalização
                            foreach($answerHeadNotEnded as $ans_while){
                                    $ans_while->finalized_at = date('Y-m-d H:i:s');
                                    $ans_while->finished_automatically = 1;
                                    $ans_while->save();
                            }

                        }
                    }
                }
            }
        }

        $answerHead = AnswersHeadEvaluation::where('fk_application_evaluation_id', '=', $idApplication)
            ->orderBy('id')
            ->get();

        if(sizeof($answerHead)==0){
            return response()->json([
                'message' => 'Não há respostas para a aplicação.'
            ], 202);
        }

        $evaluation_question = EvaluationHasQuestions::where('fk_evaluation_id', $evaluation->id)
            ->orderBy('id')
            ->get();
        //seleciona apenas o id do head para pesquisa
        $head_question_id = AnswersHeadEvaluation::where('fk_application_evaluation_id', $application->id)
            ->select('id')->get();
        $qtd_correct_whole_questions = 0;
        foreach ($evaluation_question as $ev){
            //verifica qual o item correto
            $item_correct = QuestionItem::where('fk_question_id', $ev->fk_question_id)
                ->where('correct_item', 1)->first();

            //quantidade de pessoas que acertaram a questão
            $answerCorrect = AnswersEvaluation::where('fk_evaluation_question_id', $ev->id)
                ->whereIn('fk_answers_head_id', $head_question_id)
                ->where('answer', $item_correct->id)
                ->count();
            $qtd_correct_whole_questions += $answerCorrect;
        }
        $avg_correct_question = 0;

        $total_students = $head_question_id->count();
        if($total_students > 0) {
            $avg_correct_question = $qtd_correct_whole_questions / $total_students;
        }


       // return response()->json($answers, 202);
        $result = array();
        $variance_total = 0;
        $students = array();
        foreach ($answerHead as $head) {
            $resultStudent = new \ArrayObject();

            $answers = AnswersEvaluation::where('fk_answers_head_id', $head->id)
                ->orderBy('id')
                ->get();

            $student = User::where('id',$head->fk_user_id)->first();

            $questions = array();
            $total_questions = 0;
            $count_corret_student = 0;

            $count_total_students = 1;
            foreach ($answers as $ans) {
                $total_questions++;

                $evaluation_question = EvaluationHasQuestions::where('id', $ans->fk_evaluation_question_id)
                    ->first();

                $itensQuestion = QuestionItem::where('fk_question_id', $evaluation_question->fk_question_id)
                    ->orderBy('id')
                    ->get();
                $ordem = 0;
                if($ans->answer != null) {
                    foreach ($itensQuestion as $iq) {
                        $ordem++;
                        if ($iq->id == $ans->answer) {

                            break;
                        }
                    }
                }
                switch ($ordem){
                    case 0:
                        $ordem = '-'; break;
                    case 1:
                        $ordem = 'A'; break;
                    case 2:
                        $ordem = 'B'; break;
                    case 3:
                        $ordem = 'C'; break;
                    case 4:
                        $ordem = 'D'; break;
                    case 5:
                        $ordem = 'E'; break;

                }


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
                    'ordemQuestion' => $ordem,
                ];
                $questions[] = $object;
            }

            if($total_students >0) {
                $percentage = ($count_corret_student * 100) / $total_questions;
            }

            $total_time_active = 'Avaliação não finalizada.';
            if($head->finalized_at != null){
                $dataFuturo = $head->finalized_at;
                $dataAtual = $head->created_at;

                $date_time  = new \DateTime($dataAtual);
                $diff       = $date_time->diff( new \DateTime($dataFuturo));
                //dd($diff);
                if($diff->y > 0){
                    $total_time_active = $diff->y . ' ano(s), ' . $diff->m . ' mês(es), ' . $diff->d . ' dia(s), ' . $diff->h . ' hora(s) e ' . $diff->i . ' minuto(s)';
                } else if($diff->m > 0) {
                    $total_time_active = $diff->m . ' mês(es), ' . $diff->d . ' dia(s), ' . $diff->h . ' hora(s) e ' . $diff->i . ' minuto(s)';
                } else if($diff->d > 0) {
                    $total_time_active = $diff->d . ' dia(s), ' . $diff->h . ' hora(s) e ' . $diff->i . ' minuto(s)';
                }else if($diff->h > 0){
                    $total_time_active = $diff->h . ' hora(s) e ' . $diff->i . ' minuto(s)';
                } else {
                    $total_time_active = $diff->i . ' minuto(s)';
                }

            }
            $variance = 0;
            //dd($total_students);
            if($total_students > 1) {
                $variance = pow(($count_corret_student - $avg_correct_question), 2) / ($total_students - 1);
                $variance_total += $variance;

            }

            $student_name = $student->name;
            if($application->public_results && $application->can_see_students == 0
                    && $evaluation->fk_user_id != $user->id){
                        $student_name  = 'Aluno '.$count_total_students;
            }


            $resultStudent = (object)[
                'student' => $student_name,
                'hr_start' => $head->created_at,
                'hr_finished' => $head->finalized_at,
                'finished_automatically' => $head->finished_automatically,
                'total_time' => $total_time_active,
                'variance' => number_format($variance, 3),
                'questions' => $questions,
                't_question' => $total_questions,
                't_correct' => $count_corret_student,
                'percentage_correct' => number_format($percentage, 2),
            ];
            $students[] = $resultStudent;
            $count_total_students = $count_total_students + 1;
        }
        usort(

            $students,

            function( $a, $b ) {

                if( $a->student == $b->student ) return 0;

                return ( ( $a->student < $b->student ) ? -1 : 1 );
            }
        );
        $result = (object)[
            'students' => $students,
            'avg_correct_question' => number_format($avg_correct_question, 2),
            'variance_total' => number_format($variance_total, 3),
        ];
        //$result[] = $resultVariance;

        return response()->json($result, 200);
    }


    public function resultPercentageQuestions($idApplication){
        $application = EvaluationApplication::where('id', $idApplication)->first();

        if(!$application){
            return response()->json([
                'message' => 'Aplicação não encontrada.'
            ], 202);
        }

        $class = null;
        if($application->fk_class_id != null) {
            $class = ClassQuestione::where('id', $application->fk_class_id)->first();
        }

        $evaluation = Evaluation::where('id', $application->fk_evaluation_id)->first();

        if(!$evaluation){
            return response()->json([
                'message' => 'Avaliação não encontrada.'
            ], 202);
        }

        //verificar de quem é a avaliação
        $user = auth('api')->user();
        if($user->acess_level == 0){ // verifica se é um aluno que está tentando acessar
            return response()->json([
                'message' => 'Os resultados da avaliação não podem ser apresentados.'
            ], 202);
        }

        if($application->public_results == 0){ //verifica se os resultados são públicos
            if($evaluation->fk_user_id != $user->id){ //se os resultados não forem públicos, verifica se o usuário que tenta acessar é o dono
                return response()->json([
                    'message' => 'Os resultados da avaliação não podem ser apresentados.'
                ], 202);
            }
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
            ->select('id')->get();

        $result = array();
        $resultQuestions = array();
        $percentagemGeralEvaluationCorrect = 0;
        $qtdQuestions = 0;
        $variance_total = 0;
        foreach ($evaluation_question as $ev_question){
            $qtdQuestions++;

            $question = Question::where('id', $ev_question->fk_question_id)->first();
            //verifica qual o item correto
            $item_correct = QuestionItem::where('fk_question_id', $question->id)
                ->where('correct_item', 1)->first();
            //total de pessoas que responderam a questão
            $count_total_answer_question = AnswersEvaluation::where('fk_evaluation_question_id', $ev_question->id)
                ->whereIn('fk_answers_head_id', $head_question)
                ->whereNotNull('answer')
                ->count();

            //pega todos os itens da questão
            $itens_question = QuestionItem::where('fk_question_id',$question->id)->get();

            //quantidade de pessoas que acertaram a questão
            $answer = AnswersEvaluation::where('fk_evaluation_question_id', $ev_question->id)
                ->whereIn('fk_answers_head_id', $head_question)
                ->where('answer', $item_correct->id)
                ->count();

            //média de acertos da questão
            $avg_question = 0;
            if($count_total_answer_question > 0 && $answer > 0){
                $avg_question = $answer / $count_total_answer_question;
            }

            //porcentagem de pessoas que acertam a questão
            $percentageCorrectQuestion = 0;
            if($count_total_answer_question != 0){
                $percentageCorrectQuestion = ($answer * 100)/$count_total_answer_question;
            }
            $percentagemGeralEvaluationCorrect += $percentageCorrectQuestion;

            $resultItens = array();
            $ordem = 0;
            $variance_question = 0;
            foreach($itens_question as $iq){
                $ordem++;
                //conta quantas pessoas responderam esse item
                $count_total_answer_item = AnswersEvaluation::where('fk_evaluation_question_id', $ev_question->id)
                    ->where('answer', $iq->id)
                    ->whereIn('fk_answers_head_id', $head_question)
                    ->whereNotNull('answer')
                    ->count();

                $ordemDescription = '-';
                switch ($ordem){
                    case 0:
                        $ordemDescription = '-'; break;
                    case 1:
                        $ordemDescription = 'a) '; break;
                    case 2:
                        $ordemDescription = 'b) '; break;
                    case 3:
                        $ordemDescription = 'c) '; break;
                    case 4:
                        $ordemDescription = 'd) '; break;
                    case 5:
                        $ordemDescription = 'e) '; break;

                }

                //porcentagem de acerto do item
                $percentageAnswerItem = 0;
                if($count_total_answer_question != 0) {
                    $percentageAnswerItem = ($count_total_answer_item * 100) / $count_total_answer_question;
                }
                if($iq->id == $item_correct->id){
                    //calcula variância baseado na média de acertos da questão
                    $variance_question += pow((1 - $avg_question), 2)
                                            *  $count_total_answer_item;


                    $auxItem= (object)[
                        'description' => $iq->description,
                        'total_answer_item' => $count_total_answer_item,
                        'percentage_answer' => number_format($percentageAnswerItem, 2),
                        'correct' => 1,
                        'ordem' => $ordemDescription,
                    ];
                } else {
                    //verifica se algum estudante respondeu o item
                    $virifyIfSomeStudentAnswer = AnswersEvaluation::where('fk_evaluation_question_id', $ev_question->id)
                        ->whereIn('fk_answers_head_id', $head_question)
                        ->where('answer', $iq->id)
                        ->count();
                    if($virifyIfSomeStudentAnswer>0) {
                        //calcula variância baseado na média de acertos da questão
                        $variance_question += pow((0 - $avg_question), 2) *
                                                           $virifyIfSomeStudentAnswer;
                    }

                    $auxItem= (object)[
                        'description' => $iq->description,
                        'total_answer_item' => $count_total_answer_item,
                        'percentage_answer' => number_format($percentageAnswerItem, 2),
                        'correct' => 0,
                        'ordem' => $ordemDescription,
                    ];
                }


                $resultItens[] = $auxItem;
            }



            //calcula variância dividindo pelo total de respostas

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
            if($count_total_answer_question>0) {
                $variance_question = $variance_question / $count_total_answer_question;
                $variance_total += $variance_question;
            }

            $auxQuestion= (object)[
                'idQuestion' => $question->id,
                'difficulty' => $question->difficulty,
                'cancel' => $ev_question->cancel,
                'base_text' => $question->base_text,
                'stem' => $question->stem,
                'reference' => $question->reference,
                'skill' => $descSkill,
                'course' => $course->description,
                'variance' => number_format($variance_question,3),
                'total_asnwer' => $count_total_answer_question,
                'percentage_correct' => number_format($percentageCorrectQuestion, 2),
                'percentage_correct_round' => round($percentageCorrectQuestion),
                'objects' => $resultObjects,
                'itens' => $resultItens,

            ];

            $resultQuestions[] = $auxQuestion;
        }
        //dd($variance_question, $teste);
        if($qtdQuestions>0) {
            $percentagemGeralEvaluationCorrect = $percentagemGeralEvaluationCorrect / $qtdQuestions;
        }

        //dd($evaluation_question);
        $auxEvaluation= (object)[
            'application' => $application->id,
            'idApplication' => $application->id_application,
            'variance_total' => number_format($variance_total,3),
            'class' => $class,
            'description_application' => $application->description,
            'description_evaluation' => $evaluation->description,
            'percentagem_geral_correct_evaluation' => number_format($percentagemGeralEvaluationCorrect, 2),
            'qtdQuestions' => $qtdQuestions,
            'qtdStudents' => $head_question->count(),
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
        if($user->acess_level == 0){ // verifica se é um aluno que está tentando acessar
            return response()->json([
                'message' => 'Os resultados da avaliação não podem ser apresentados.'
            ], 202);
        }
        if($application->public_results == 0){ //verifica se os resultados são públicos
            if($evaluation->fk_user_id != $user->id){ //se os resultados não forem públicos, verifica se o usuário que tenta acessar é o dono
                return response()->json([
                    'message' => 'Os resultados da avaliação não podem ser apresentados.'
                ], 202);
            }
        }

        $evaluation_question = EvaluationHasQuestions::where('fk_evaluation_id', $evaluation->id)->get();

        if (sizeof($evaluation_question) == 0) {
            return response()->json([
                'message' => 'Nenhuma questão foi encontrada.'
            ], 202);
        }

        $head_question = AnswersHeadEvaluation::where('fk_application_evaluation_id', $application->id)
            ->select('id')->get();

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
                            ->whereIn('fk_answers_head_id', $head_question)
                            ->whereNotNull('answer')
                            ->count();

                        //quantidade de pessoas que acertaram a questão
                        $total_answer_correct += AnswersEvaluation::where('fk_evaluation_question_id', $ev_question->id)
                            ->whereIn('fk_answers_head_id', $head_question)
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
        //verificar de quem é a avaliação
        $user = auth('api')->user();
        if($user->acess_level == 0){ // verifica se é um aluno que está tentando acessar
            return response()->json([
                'message' => 'Os resultados da avaliação não podem ser apresentados.'
            ], 202);
        }

        if($application->public_results == 0){ //verifica se os resultados são públicos
            if($evaluation->fk_user_id != $user->id){ //se os resultados não forem públicos, verifica se o usuário que tenta acessar é o dono
                return response()->json([
                    'message' => 'Os resultados da avaliação não podem ser apresentados.'
                ], 202);
            }
        }

        $evaluation_question = EvaluationHasQuestions::where('fk_evaluation_id', $evaluation->id)->get();

        if (sizeof($evaluation_question) == 0) {
            return response()->json([
                'message' => 'Nenhuma questão foi encontrada.'
            ], 202);
        }

        $head_question = AnswersHeadEvaluation::where('fk_application_evaluation_id', $application->id)
            ->select('id')->get();

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
                            ->whereIn('fk_answers_head_id', $head_question)
                            ->whereNotNull('answer')
                            ->count();

                        //quantidade de pessoas que acertaram a questão
                        $total_answer_correct += AnswersEvaluation::where('fk_evaluation_question_id', $ev_question->id)
                            ->whereIn('fk_answers_head_id', $head_question)
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
