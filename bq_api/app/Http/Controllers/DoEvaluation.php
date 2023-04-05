<?php

namespace App\Http\Controllers;

use App\AnswersEvaluation;
use App\Evaluation;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
use App\AnswersHeadEvaluation;
use App\Notifications\StudentFinishEvaluationToProfessorNotification;
use App\User;
use Illuminate\Http\Request;
use Validator;

class DoEvaluation extends Controller
{

    public function __construct()
    {
        $this->middleware(['jwt.auth']);
    }

    public function getApplication($id){

        $evaluation_application = EvaluationApplication::where('id_application', $id)
            ->with('evaluation')
            ->first();
        $user = auth('api')->user();
        if(!$evaluation_application){
            return response()->json([
                'message' => 'A avaliação não foi encontrada.'
            ], 202);
        }
        if($evaluation_application->evaluation->practice == 1){

            if($user->id != $evaluation_application->evaluation->user->id){
                return response()->json([
                    'message' => 'O código pertence a uma avaliação prática de outro usuário.'
                ], 202);
            }
        }
        //procura o cabeçalho da avaliação para saber se o aluno já iniciou a avaliação
        $head_answer = AnswersHeadEvaluation::where('fk_user_id', $user->id)
            ->where('fk_application_evaluation_id', $evaluation_application->id)->first();

        //student_started 0 - Não inicou e 1 - inicou
        $evaluation_application->student_started = 0;
        if($head_answer){
            $evaluation_application->student_started = 1;

            if($head_answer->finalized_at){
                return response()->json([
                    'message' => 'A avaliação já foi respondida pelo usuário.'
                ], 202);
            }

        }


        if($evaluation_application){
            return response()->json($evaluation_application, 200);
        } else {
            return response()->json($evaluation_application, 202);
        }
    }

    public function startEvaluation($idApplication){

        $user = auth('api')->user();

        $application = EvaluationApplication::where('id_application', $idApplication)->first();

        if(!$application){
            return response()->json([
                'message' => 'A aplicação não foi encontrada.'
            ], 202);
        }

        if($application->status==0){
            return response()->json([
                'message' => 'A aplicação está desabilitada.'
            ], 202);
        }

        if($application->evaluation->practice == 1){
            $user = auth('api')->user();

            if($user->id != $application->evaluation->user->id){
                return response()->json([
                    'message' => 'O código pertence a uma avaliação prática de outro usuário.'
                ], 202);
            }
        }

        $questions_evaluations = EvaluationHasQuestions::where('fk_evaluation_id', $application->fk_evaluation_id)
            ->get();

        if(sizeof($questions_evaluations)==0){
            return response()->json([
                'message' => 'Avaliação não possui questões.'
            ], 202);
        }

        //procura o cabeçalho da avaliação
        $head_answer = AnswersHeadEvaluation::where('fk_user_id', $user->id)
            ->where('fk_application_evaluation_id', $application->id)->first();

        //pega a data atual
        $dateNow = date('Y-m-d');
        if($head_answer){
            //verifica se tem avaliação e já foi finalizada
            if($head_answer->finalized_at != null){
                return response()->json([
                    'message' => 'Avaliação já foi respondida por você.'
                ], 202);
            }

           if($application->time_to_finalize) {
               //pega o time e divide em horas, minutos e segundos
               $horas = substr($application->time_to_finalize, 0, 2);
               $minutos = substr($application->time_to_finalize, 3, 2);
               $segundos = substr($application->time_to_finalize, 6, 2);

               //pega o horário que a avaliação foi criada e acrescenta a ela o tempo para finalizar definido pelo professor
               $timeStudentShouldFinishedEvaluation = $head_answer->created_at;
               $timeStudentShouldFinishedEvaluation->add(new \DateInterval('PT' . $horas . 'H' . $minutos . 'M' . $segundos . 'S'));
               $dateNow = new \DateTime(date('Y-m-d H:i'));

               if ($timeStudentShouldFinishedEvaluation < $dateNow) {

                   $head_answer->finalized_at = date('Y-m-d H:i:s');
                   $head_answer->finished_automatically = 1;
                   $head_answer->save();

                   //aqui deve finalizar a avaliação automaticamente

                   return response()->json([
                       'closed' => '1',
                       'message' => 'O seu tempo para finalizar a avaliação acabou. A sua avaliação foi encerrada automaticamente.'
                   ], 202);
               }
           }

        } else {

            //verifica se o professor pre detemrinou uma data e horário específico para iniciar a avaliação
            if($application->date_start){

                //verifica se a data atual é igual a data de iniciar a avaliação
                if($application->date_start == $dateNow){
                    //verifica se tem hora inicial

                    if($application->time_start){
                        //pega hora atual
                        $timeStartedEvaluationStarted = new \DateTime(date('H:i'));
                        $timeFinisedEvaluationStarted = new \DateTime(date('H:i'));
                        //pega hora que foi inserida pelo professor para iniciar a avaliação
                        $timeInserted = new \DateTime($application->time_start);
                        //diminui 05 minutos para especificar o tempo inicial para iniciar limite
                        $timeStartedEvaluationStarted->sub(new \DateInterval('PT5M'));
                        //aumenta 05 minutos para especificar o tempo final pata iniciar limite
                        $timeFinisedEvaluationStarted->add(new \DateInterval('PT5M'));

                        //horário que o estudante deve iniciar a avaliação
                        $timeStudentShouldStarted = new \DateTime($application->time_start);
                        $timeStudentShouldFinished = new \DateTime($application->time_start);
                        $timeStudentShouldStarted->sub(new \DateInterval('PT5M'));
                        $timeStudentShouldFinished->add(new \DateInterval('PT5M'));

                        $dateCanStart = new \DateTime($application->date_start);

                        if(!($timeInserted >= $timeStartedEvaluationStarted && $timeInserted <= $timeFinisedEvaluationStarted)){
                            return response()->json([
                                'message' => 'A avaliação não pode ser iniciada. '.
                                    'O estudante só poderá iniciar esta avaliação entre o horário '.$timeStudentShouldStarted->format('H:i').
                                    ' e '. $timeStudentShouldFinished->format('H:i').' do dia '
                                    .$dateCanStart->format('d/m/Y').'.'
                            ], 202);
                        }
                    }

                } else {

                    $dateCanStart = new \DateTime($application->date_start);
                    return response()->json([
                        'message' => 'A avaliação não pode ser iniciada. '.
                            'O estudante só poderá iniciar esta avaliação no dia '
                            .$dateCanStart->format('d/m/Y'). ' às '.$application->time_start.'.'
                    ], 202);
                }

            }

            //senão tem avaliação, então cria nova
            $head_answer = new AnswersHeadEvaluation();
            $head_answer->fk_application_evaluation_id = $application->id;
            $head_answer->fk_user_id = $user->id;
            $head_answer->finalized_at = null;
            $head_answer->save();

        }

        if($application->date_finish){ //verifica se existe date_finish
            //verifica se a data de finalizar é menor que a atual
            if($application->date_finish <= $dateNow){
                //verifica se existe hora para terminar
                if($application->time_finish){
                    //$timeFinish = new \DateTime($application->time_finish); // converte a hora em DateTime
                    //verifica se a hora já passou
                    $hour = date('H:i');
                    if($application->time_finish < $hour){

                        $head_answer->finalized_at = date('Y-m-d H:i:s');
                        $head_answer->finished_automatically = 1;
                        $head_answer->save();

                        return response()->json([
                            'closed' => '1',
                            'message' => 'O prazo para finalizar a avaliação já se encerrou. A avaliação foi encerrada automaticamente.'
                        ], 202);
                    }
                }
            }
        }

        foreach ($questions_evaluations as $question){
            //verifica se já não tem uma resposta inserida
            $verify = AnswersEvaluation::where('fk_answers_head_id', $head_answer->id)
                ->where('fk_evaluation_question_id', $question->id)->get();
            if(sizeof($verify)>0){
                continue;
            }
            //senão tiver, cadastra uma nova com a resposta nula
            $answer = new AnswersEvaluation();
            $answer->answer = null; //answer representa o id da questão
            $answer->fk_evaluation_question_id = $question->id;
            $answer->fk_answers_head_id = $head_answer->id;
            $answer->save();

        }

        //dd($head_answer);
        $answerHead = AnswersHeadEvaluation::where('fk_user_id', $user->id)
            ->where('fk_application_evaluation_id', $application->id)
            ->first();

        //verifica se a aplicação possui opção de questões aleatórias
        if($application->random_questions == 1) {

            $answers = AnswersEvaluation::where('fk_answers_head_id', $answerHead->id)
                ->inRandomOrder()
                ->with('evaluationQuestionWithoutCorrect')
                ->get();
        } else {

            $answers = AnswersEvaluation::where('fk_answers_head_id', $answerHead->id)
                ->with('evaluationQuestionWithoutCorrect')
                ->get();
            

        }

        $date_time_to_finalized = null;
        if($application->time_to_finalize){
            //atributo dt_created informará a data e horário corretos (sem diferença de 3 horas)
            //$evaluation_application->dt_created = new \DateTime($evaluation_application->created_at);
            //pega o time e divide em horas, minutos e segundos
            $horas = substr($application->time_to_finalize, 0, 2);
            $minutos = substr($application->time_to_finalize, 3, 2);
            $segundos = substr($application->time_to_finalize, 6, 2);

            //pega o horário que a avaliação foi criada e acrescenta a ela o tempo para finalizar definido pelo professor
            $timeStudentShouldFinishedEvaluation = $head_answer->created_at;

            $timeStudentShouldFinishedEvaluation->add(new \DateInterval('PT'.$horas.'H'.$minutos.'M'.$segundos.'S'));

            //$answers->date_time_to_finalized = new \DateTime($timeStudentShouldFinishedEvaluation);
            $date_time_to_finalized = new \DateTime($timeStudentShouldFinishedEvaluation);
        } else if($application->date_finish){
            $date_time_to_finalized = new \DateTime($application->date_finish . $application->time_finish);
        }

        $date_server =  new \DateTime();
        return response()->json([
           "date_server" => $date_server,
            "date_time_to_finalized" => $date_time_to_finalized,
            $answers], 200);
    }

    public function answer(Request $request, $id_application){

        $user = auth('api')->user();

        if(!$request->id){
            return response()->json([
                'message' => 'Informe o código da resposta.'
            ], 202);
        }

        if(!$request->answer){
            return response()->json([
                'message' => 'Informe a resposta.'
            ], 202);
        }

        $answer = AnswersEvaluation::where('id', $request->id)->first();
        if(!$answer){
            return response()->json([
                'message' => 'Código de resposta não encontrado.'
            ], 202);
        }
        //dd($answer);

        $answer_head = AnswersHeadEvaluation::where('id', $answer->fk_answers_head_id)->first();
        if(!$answer_head){
            return response()->json([
                'message' => 'Cabeçalho da avaliação não encontrado.'
            ], 202);
        }

        if($answer_head->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Código de resposta não pertence ao usuário logado.'
            ], 202);
        }

        if($answer_head->finalized_at != null){
            return response()->json([
                'message' => 'A avaliação está com a situação: FINALIZADA.'
            ], 202);
        }

        $application_evaluation = EvaluationApplication::where('id',
            $answer_head->fk_application_evaluation_id)->first();
        if($application_evaluation->status == 0){
            return response()->json([
                'message' => 'A aplicação está desativada.'
            ], 202);
        }

        //verifica se a avaliação tem tempo pré-determinado para terminar e finaliza automaticamente
        if($application_evaluation->time_to_finalize){
            //pega o time e divide em horas, minutos e segundos
            $horas = substr($application_evaluation->time_to_finalize, 0, 2);
            $minutos = substr($application_evaluation->time_to_finalize, 3, 2);
            $segundos = substr($application_evaluation->time_to_finalize, 6, 2);

            //pega o horário que a avaliação foi criada e acrescenta a ela o tempo para finalizar definido pelo professor
            $timeStudentShouldFinishedEvaluation = $answer_head->created_at;
            $timeStudentShouldFinishedEvaluation->add(new \DateInterval('PT'.$horas.'H'.$minutos.'M'.$segundos.'S'));
            $dateNow = new \DateTime(date('Y-m-d H:i'));
            if($timeStudentShouldFinishedEvaluation < $dateNow){

                $answer_head->finalized_at = date('Y-m-d H:i:s');
                $answer_head->finished_automatically = 1;
                $answer_head->save();

                //aqui deve finalizar a avaliação automaticamente

                return response()->json([
                    'closed' => '1',
                    'message' => 'O seu tempo para finalizar a avaliação acabou. A sua avaliação foi encerrada automaticamente.'
                ], 202);
            }
        } else { //verifica se a avaliação tem uma data e uma hora de encerramento
            if($application_evaluation->date_finish){ //verifica se existe date_finish
                //verifica se a data de finalizar é menor que a atual
                if($application_evaluation->date_finish <= date('Y-m-d')){
                    //verifica se existe hora para terminar
                    if($application_evaluation->time_finish){
                        //$timeFinish = new \DateTime($application->time_finish); // converte a hora em DateTime
                        //verifica se a hora já passou
                        $hour = date('H:i');
                        if($application_evaluation->time_finish < $hour){

                            $answer_head->finalized_at = date('Y-m-d H:i:s');
                            $answer_head->finished_automatically = 1;
                            $answer_head->save();

                            return response()->json([
                                'closed' => '1',
                                'message' => 'O prazo para finalizar a avaliação já se encerrou. A avaliação foi encerrada automaticamente.'
                            ], 202);
                        }
                    }
                }
            }
        }

        $answer->answer = $request->answer;
        $answer->save();

        return response()->json($answer, 200);
    }

    public function finishEvaluation(Request $request, $idApplication){
        $user = auth('api')->user();

        $application = EvaluationApplication::where('id_application', $idApplication)->first();


        if(!$application){
            return response()->json([
                'message' => 'A Aplicação não foi encontrada.'
            ], 202);
        }

        if($application->status==0){
            return response()->json([
                'message' => 'A Aplicação está desabilitada.'
            ], 202);
        }

        $evaluation = Evaluation::where('id', $application->fk_evaluation_id)->first();

        $answer_head = AnswersHeadEvaluation::where('fk_user_id', $user->id)
            ->where('fk_application_evaluation_id', $application->id)
            ->first();
        if(!$answer_head){
            return response()->json([
                'message' => 'O Cabeçalho da avaliação não foi encontrado.'
            ], 202);
        }

        if($answer_head->finalized_at != null){
            return response()->json([
                'message' => 'A avaliação está com a situação: FINALIZADA.'
            ], 202);
        }

        //verifica se tem questão que não foi respondida
        $answer = AnswersEvaluation::where('fk_answers_head_id', $answer_head->id)
            ->where('answer', null)
            ->get();

        //verifica se já deu o tempo final da aplicação e finaliza automaticamente
        if($request->finished_automatically){
            $answer_head->finished_automatically = 1;
        } else
        if(sizeof($answer)>0){
            return response()->json([
                'message' => 'Para finalizar a avaliação, responda todas as questões.'
            ], 202);
        }
        //dd(date('Y-m-d H:i:s'));
        $answer_head->finalized_at = date('Y-m-d H:i:s');

        $answer_head->save();

        $evaluation = Evaluation::where('id', $application->fk_evaluation_id)->first();
        $userOwner = User::where('id', $evaluation->fk_user_id)->first();
        $userStudent = User::where('id', $answer_head->fk_user_id)->first();
        if($evaluation->practice == 0) { //só envia o e-mail caso a avaliação não for prática
            $userOwner->notify(new StudentFinishEvaluationToProfessorNotification($userOwner, $userStudent, $evaluation));
        }

        return response()->json([
            'message' => 'Avaliação finalizada.'
        ], 200);

    }

}
