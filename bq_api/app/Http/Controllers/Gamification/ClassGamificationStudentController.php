<?php

namespace App\Http\Controllers\Gamification;

use App\AnswersEvaluation;
use App\AnswersHeadEvaluation;
use App\ClassBadgesStudent;
use App\ClassQuestione;
use App\ClassStudents;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
use App\Http\Controllers\Controller;
use App\Notifications\BadgesNotifications;
use App\QuestionItem;
use App\RPPoints;
use App\XPPoints;
use Illuminate\Support\Facades\DB;
use Validator;

class ClassGamificationStudentController extends Controller
{
    public function totalXP(int $idclass, $student = null){
        $user = auth('api')->user();
        if($student){
            $user = $student;
        }

        if(!$this->checkClass($idclass)){
            return response()->json([
                'message' => 'Turma não encontrada.'
            ], 202);
        }

        $xp = XPPoints::where('fk_class_id', $idclass)
            ->where('fk_user_id', $user->id)->sum('point');

        return response()->json($xp, 200);

    }

    public function historyXP(int $idclass){
        $user = auth('api')->user();

        if(!$this->checkClass($idclass)){
            return response()->json([
                'message' => 'Turma não encontrada.'
            ], 202);
        }

        $xp = XPPoints::where('fk_class_id', $idclass)
            ->where('fk_user_id', $user->id)
            ->orderby('id', 'asc')
            ->with('configGamification')
            ->get();

        return response()->json($xp, 200);

    }

    public function getBadges(int $idclass){
        $user = auth('api')->user();

        if(!$this->checkClass($idclass)){
            return response()->json([
                'message' => 'Turma não encontrada.'
            ], 202);
        }

        $badges = ClassBadgesStudent::where('fk_class_id', $idclass)
            ->where('fk_user_id', $user->id)
            ->with('badgesSettings')
            ->select('description_id', DB::raw('count(*) as total'))
            ->groupBy('description_id')
            ->orderBy('total', 'desc')
            ->get();

        return response()->json($badges, 200);

    }

    public function rankPosition(int $idclass, $student = null){
        $user = auth('api')->user();
        if($student){
            $user = $student;
        }

        if(!$this->checkClass($idclass)){
            return response()->json([
                'message' => 'Turma não encontrada.',
                'position' => 0
            ], 202);
        }

        $class_students = ClassStudents::where('fk_class_id', $idclass)->get();

        /*
         * Veririfca se pode calcular o rank, caso tenho alguma pontuação de XP que
         * não seja de entrada na turma
         */
        $verify = XPPoints::where('fk_class_id', $idclass)
            ->where('description_id', 'mark_correct_question')
            ->whereOr('description_id', 'complete_a_test')
            ->whereOr('description_id', 'mark_correct_question')
            ->whereOr('description_id', 'correctly_mark_all_questions')
            ->whereOr('description_id', 'get_badge')
            ->get();

        if(sizeof($verify)==0){
            return response()->json([
                'string' => '? / '.sizeof($class_students),
                'position' => 0
            ], 200);
        }

        $array_rank = array();
        foreach ($class_students as $item){
            /*
                Verifica o total de XP para definir a posição no ranking
                o critério de desempate é o total de consquitas e
                o total de simulados respondidos
            */
            $xp = XPPoints::where('fk_class_id', $idclass)
                ->where('fk_user_id', $item->fk_user_id)->sum('point');

            $badges = ClassBadgesStudent::where('fk_class_id', $idclass)
                ->where('fk_user_id', $item->fk_user_id)->count();

            $applications_id = EvaluationApplication::where('fk_class_id', $idclass)->get();
            $id_application = array();
            foreach ($applications_id as $app){
                $id_application[] = $app->id;
            }

            $head_answer = AnswersHeadEvaluation::whereIn('fk_application_evaluation_id', $id_application)
                ->whereNotNull('finalized_at')
                ->where('fk_user_id', $item->fk_user_id)
                ->count();

            $result = (object)[
                'xp' => $xp,
                'total_badges' => $badges,
                'applications_finalized' => $head_answer,
                'user' => $item->fk_user_id,
            ];
            $array_rank[] = $result;
        }

        usort(
            $array_rank,
            function( $a, $b ) {
                if( $a->xp != $b->xp )
                    return ( ( $a->xp > $b->xp ) ? -1 : 1 );

                if( $a->xp == $b->xp ) {
                    if ( $a->total_badges != $b->total_badges ) {
                        return (($a->total_badges > $b->total_badges) ? -1 : 1);
                    } else {
                        return (($a->applications_finalized > $b->applications_finalized) ? -1 : 1);
                    }
                }
                return 0;
            }
        );

        //rsort($array_rank); //reordena a lista

        $position = 0;
        foreach ($array_rank as $item){
            $position++;
            if($item->user == $user->id){
                break;
            }
        }

        $size_array = sizeof($array_rank);
        $string = $position.'/'.$size_array;

        return response()->json([
            'string' => $string,
            'position' => $position
        ], 200);

    }

    public function totalRP(int $idclass){
        $user = auth('api')->user();

        if(!$this->checkClass($idclass)){
            return response()->json([
                'message' => 'Turma não encontrada.'
            ], 202);
        }

        $rp_credit = RPPoints::where('fk_class_id', $idclass)
            ->where('fk_user_id', $user->id)
            ->where('type', 'C')
            ->sum('point');

        $rp_debit = RPPoints::where('fk_class_id', $idclass)
            ->where('fk_user_id', $user->id)
            ->where('type', 'D')
            ->sum('point');

        $rp_total = $rp_credit + $rp_debit;

        $this->verifyMedals($idclass);

        return response()->json($rp_total, 200);
    }

    public function checkIfHaveEnoughRP($id_class, $debitValue){
        $totalRP = $this->totalRP($id_class);
        if($totalRP){
            $totalRP = $totalRP->original;
            return ($debitValue + $totalRP) >= 0;
        }

        return false;
    }

    public function messageForInsufficientRPStock(){
        $array_string_divertidas = array();
        $array_string_divertidas[] = 'Você está com um estoque de pontos reutilizáveis que mais parece um deserto de criatividade! 😅💡';
        $array_string_divertidas[] = 'Você está com uma reserva de pontos reutilizáveis mais escassa que um deserto de ideias em dia de chuva! 😅💡';
        $array_string_divertidas[] = 'Parece que você está com poucos "pontos mágicos" no seu arsenal! ✨🧙';
        $array_string_divertidas[] = 'Parece que você está com uma cestinha de "pontos reutilizáveis" vazia! 😅🔄️';
        $array_string_divertidas[] = 'Você está mais "vazio de pontos reutilizáveis" do que um emoji de carinha triste! 😕🔄';
        $array_string_divertidas[] = 'Seus pontos reutilizáveis estão mais raros que unicórnios! 🦄🪄😅';
        $array_string_divertidas[] = 'Parece que você está com o baú dos "pontos reutilizáveis" meio vazio! 😅🧰';
        $array_string_divertidas[] = 'Parece que alguém pegou sua sacola de pontos reutilizáveis e saiu correndo! 🏃‍😅';
        $array_string_divertidas[] = 'Parece que você acionou o modo "zerar pontos reutilizáveis"! Hora de começar uma nova aventura para recarregar o placar! 🎮😄';
        $array_string_divertidas[] = 'Parece que você apertou o botão "reset" nos seus pontos reutilizáveis. É hora de partir para uma nova missão em busca desses tesouros perdidos! 🕹️😅';
        $position_string_resposta = array_rand($array_string_divertidas, 1);

        return $array_string_divertidas[$position_string_resposta];
    }

    private function verifyMedals($idclass){
        $application = EvaluationApplication::where('fk_class_id', $idclass)->get();
        $class_students = ClassStudents::where('fk_class_id', $idclass)->get();

        $a = 0;
        $obj_evaluation = array();
        if(sizeof($class_students)>=3){
            foreach ($application as $item){
                $timeZone = new \DateTimeZone('UTC');
                //$data = \DateTime::createFromFormat('Y-m-d', $item->date_finish);
                //$data2 = \DateTime::createFromFormat ('d/m/Y', date('Y-m-d'), $timeZone);
                $dateFinish = new \DateTime($item->date_finish);
                $dateNow = new \DateTime(date('Y-m-d'));


                if($item->date_finish && ($dateFinish <= $dateNow)){ //verifica se a data passou

                    if($dateFinish == $dateNow){
                        $hourFinish = new \DateTime($item->time_finish);
                        $hourNow = new \DateTime(date('H:i:s'));
                        if($hourFinish > $hourNow){
                            //verifica se a hora já passou
                            continue ;
                        }

                    }
                    $verify_badge = ClassBadgesStudent::where('description_id', 'achieve_first_placement_gold')
                        ->where('fk_class_id', $item->fk_class_id)
                        ->where('fk_evaluation_aplication_id', $item->id)
                        ->first(); //verifica se o badge já foi dado para o simulado
                    if(!$verify_badge){
                        $answers_head = AnswersHeadEvaluation::where('fk_application_evaluation_id', $item->id)
                            ->with('user')
                            ->get();

                        $obj_answer_head = array();
                        foreach ($answers_head as $ah){
                            $objectApplicationWithPoints = $this->resultByApplicationWithPoints($ah);
                            $obj_answer_head[] = $objectApplicationWithPoints;
                        }

                        /*
                         * ordena cada simulado colcoando em primeiro lugar quem acertou mais, como criétio
                         * de desempate utilizou-se o menor tempo de resposta
                        */
                        usort(
                            $obj_answer_head,
                            function( $a, $b ) {
                                if( $a->total_correct == $b->total_correct ) return ( ( $a->time_convert < $b->time_convert ) ? -1 : 1 );
                                return ( ( $a->total_correct > $b->total_correct ) ? -1 : 1 );
                            }
                        );

                        $auxApplication= (object)[
                            'application' => $item,
                            'answer_head' => $obj_answer_head,
                        ];

                        $obj_evaluation[] = $auxApplication;

                        /*
                        * Verifica a possibilidade de ganhar medalhas
                        */
                        $badge = new BadgesController();
                        $badge->getMedals($auxApplication);
                    }

                }

            }

        }
        return $obj_evaluation;
    }

    private function resultByApplicationWithPoints($application){
        $total_answers_correct = 0;
        $answers = AnswersEvaluation::where('fk_answers_head_id', $application->id)->get();
        foreach ($answers as $answer){
            $evaluation_question = EvaluationHasQuestions::where('id', $answer->fk_evaluation_question_id)
                ->with('question')
                ->first();
            $item_correct = QuestionItem::where('fk_question_id', $evaluation_question->question->id)
                ->where('correct_item', 1)->first();
            if($item_correct->id == $answer->answer){
                //usuário acertou a questão
                $total_answers_correct += 1;

            }
        }
        //finaliza automaticamente as que não foram finalizadas ainda.
        if(!$application->finalized_at){
            $this->automaticallyTerminateAnApplication($application);
        }

        $diff_dates = $application->created_at->diff($application->finalized_at);
        $time_convert = $this->convertDiffDates($diff_dates);

        $return = (object)[
            'student' => $application->user,
            'time_convert' => $time_convert,
            'time_to_respond' => $diff_dates,
            'total_correct' => $total_answers_correct
        ];

        return $return;

    }

    private function automaticallyTerminateAnApplication($application){
        $application->finalized_at = date('Y-m-d H:i:s');
        $application->finished_automatically = 1;
        $application->save();
    }

    private function convertDiffDates($diff){
        $days = 0;
        if($diff->s > 0){
            $days = ($diff->s / 86400);
        }
        if($diff->i > 0){
            $days = (($diff->i+$days) / 1440);
        }
        if($diff->h > 0){
            $days = (($diff->h + $days)/24);
        }

        $value_convert = $diff->format('%a') + $days;


        return number_format($value_convert, 6);
    }

    public function historyRP(int $idclass){
        $user = auth('api')->user();

        if(!$this->checkClass($idclass)){
            return response()->json([
                'message' => 'Turma não encontrada.'
            ], 202);
        }

        $rp = RPPoints::where('fk_class_id', $idclass)
            ->where('fk_user_id', $user->id)
            ->orderby('id', 'asc')
            ->with('configGamification')
            ->get();

        return response()->json($rp, 200);

    }

    private function checkClass(int $idclass){
        $class = ClassQuestione::where('id', $idclass)->first();

        if(!$class){
            return false;
        }
        return true;
    }

}
