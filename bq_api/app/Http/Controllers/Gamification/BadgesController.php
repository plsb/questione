<?php

namespace App\Http\Controllers\Gamification;

use App\AnswersEvaluation;
use App\AnswersHeadEvaluation;
use App\ClassBadgesParameters;
use App\ClassBadgesSettings;
use App\ClassBadgesStudent;
use App\ClassGamificationSettings;
use App\ClassQuestione;
use App\EvaluationApplication;
use App\Http\Controllers\Controller;
use App\Notifications\BadgesNotifications;
use App\RPPoints;
use App\XPPoints;
use Validator;

class BadgesController extends Controller
{

    public function __construct()
    {
        //$this->middleware(['cors']);
    }

    public function get100XP($id_class)
    {
        //se a turma não for gamificada encerra a função
        if(!$this->isGamified($id_class)){
            return null;
        }

        $id_badge = 'get_100_xp';

        $user = auth('api')->user();

        $controller = new ClassGamificationStudentController();
        $totalXP = $controller->totalXP($id_class);

        if($totalXP->original >= 100){
            $verify = ClassBadgesStudent::where('fk_class_id', $id_class)
                ->where('fk_user_id', $user->id)
                ->where('description_id', $id_badge)->first();

            if(!$verify){ //verifica se o estudante já tem o badge caso não, adiciona
                $this->saveTheBadge($id_badge, $id_class, $user->id, null,  true);

            }

        }
    }

    public function fiveCorrectQuestions($id_class){
        //se a turma não for gamificada encerra a função
        if(!$this->isGamified($id_class)){
            return null;
        }

        $id_badge = 'five_correct_questions';
        $value_parameter_max = 5;

        $user = auth('api')->user();

        $verify = ClassBadgesParameters::where('fk_class_id', $id_class)
            ->where('fk_user_id', $user->id)
            ->where('description_id', $id_badge)->first();

        if(!$verify){
            $this->saveBadgeParameter(null, $id_class, $id_badge, 1, $user->id);
        } else if($verify->parameter < $value_parameter_max){
            $parameter = $verify->parameter + 1;
            $this->saveBadgeParameter($verify, $id_class, $id_badge, $parameter, $user->id);

            if($parameter == $value_parameter_max){
                $this->saveTheBadge($id_badge, $id_class, $user->id, null, true);

            }
        }
    }

    public function tenCorrectQuestions($id_class){
        //se a turma não for gamificada encerra a função
        if(!$this->isGamified($id_class)){
            return null;
        }

        $id_badge = 'ten_correct_questions';
        $value_parameter_max = 10;

        $user = auth('api')->user();

        $verify = ClassBadgesParameters::where('fk_class_id', $id_class)
            ->where('fk_user_id', $user->id)
            ->where('description_id', $id_badge)->first();

        if(!$verify){
            $this->saveBadgeParameter(null, $id_class, $id_badge, 1, $user->id);
        } else if($verify->parameter < $value_parameter_max){
            $parameter = $verify->parameter + 1;
            $this->saveBadgeParameter($verify, $id_class, $id_badge, $parameter, $user->id);

            if($parameter == $value_parameter_max){
                $this->saveTheBadge($id_badge, $id_class, $user->id, null, true);
            }
        }
    }

    public function correctlyAnswerTwoSimulations($id_class){
        //se a turma não for gamificada encerra a função
        if(!$this->isGamified($id_class)){
            return null;
        }

        //Acertar completamente dois simulados
        $id_badge = 'correctly_answer_two_simulations';
        $value_parameter_max = 2;

        $user = auth('api')->user();

        $verify = ClassBadgesParameters::where('fk_class_id', $id_class)
            ->where('fk_user_id', $user->id)
            ->where('description_id', $id_badge)->first();

        if(!$verify){
            $this->saveBadgeParameter(null, $id_class, $id_badge, 1, $user->id);

        } else if($verify->parameter < $value_parameter_max){
            $parameter = $verify->parameter + 1;
            $this->saveBadgeParameter($verify, $id_class, $id_badge, $parameter, $user->id);

            if($parameter == $value_parameter_max){
                $this->saveTheBadge($id_badge, $id_class, $user->id, null, true);
            }
        }

    }

    public function answerATestSameDayWasPosted($id_class, $id_head){
        //se a turma não for gamificada encerra a função
        if(!$this->isGamified($id_class)){
            return null;
        }

        //Responder um simulado no mesmo dia que foi publicado
        $id_badge = 'answer_a_test_same_day_was_posted';

        $user = auth('api')->user();

        $head = AnswersHeadEvaluation::where('fk_user_id', $user->id)
            ->where('id', $id_head)
            ->whereNotNull('finalized_at')->first();

        if($head){
            $application = EvaluationApplication::where('id', $head->fk_application_evaluation_id)->first();


            if($application){
                $date =  \DateTime::createFromFormat('Y-m-d H:i:s', $head->finalized_at);
                $date_finished_formated = $date->format('Y-m-d');

                $date =  \DateTime::createFromFormat('Y-m-d H:i:s', $application->created_at);
                $date_application_created_formated = $date->format('Y-m-d');
                $isDateEquals = $date_finished_formated == $date_application_created_formated;

                if($isDateEquals){
                    $this->saveTheBadge($id_badge, $id_class, $user->id, $application->id, true);
                }

            }
        }

    }

    public function getMedals($object){
        if(!$object){
            return ;
        }
        if(!$this->isGamified($object->application->fk_class_id)){
            return null;
        }
        if(sizeof($object->answer_head) == 0){
            return ;
        }
        $id_badge_gold_medal = 'achieve_first_placement_gold';
        $id_badge_silver_medal = 'achieve_second_placement_silver';
        $id_badge_bronze_medal = 'achieve_third_placement_bronze';
        $id_badge_two_gold_medals = 'two_gold_medals';
        $value_parameter_max_two_gold_medals = 2;

        /*
         * Verifica se na turma já Não foi dado um badge para
         * o simulado em questão
         */
        if($this->verifyIfBadgeExistsInTheApplication($object->application, $id_badge_gold_medal)) return ;
        if($this->verifyIfBadgeExistsInTheApplication($object->application, $id_badge_silver_medal)) return ;
        if($this->verifyIfBadgeExistsInTheApplication($object->application, $id_badge_bronze_medal)) return ;


        $position = 1;
        foreach ($object->answer_head as $item){

            if($position == 4) break;

            switch ($position){
                case 1:
                    $this->saveTheBadge($id_badge_gold_medal, $object->application->fk_class_id,
                                                    $item->student->id, $object->application->id, false);

                    /*
                     * Verifica se acumulou duas medalhas de ouro e dá o badge correspondente
                     */
                    $verify = ClassBadgesParameters::where('fk_class_id', $object->application->fk_class_id)
                        ->where('fk_user_id', $item->student->id)
                        ->where('description_id', $id_badge_two_gold_medals)->first();
                    if(!$verify){
                        $this->saveBadgeParameter(null, $object->application->fk_class_id, $id_badge_two_gold_medals,
                                    1, $item->student->id);
                    } else if($verify->parameter < $value_parameter_max_two_gold_medals){
                        $parameter = $verify->parameter + 1;
                        $this->saveBadgeParameter($verify, $object->application->fk_class_id, $id_badge_two_gold_medals,
                            $parameter, $item->student->id);

                        if($parameter == $value_parameter_max_two_gold_medals){
                            $this->saveTheBadge($id_badge_two_gold_medals, $object->application->fk_class_id,
                                $item->student->id, $object->application->id, true);
                        }
                    }
                    break;
                case 2: $this->saveTheBadge($id_badge_silver_medal, $object->application->fk_class_id,
                                                    $item->student->id, $object->application->id, false);
                        break;
                case 3: $this->saveTheBadge($id_badge_bronze_medal, $object->application->fk_class_id,
                                                    $item->student->id, $object->application->id, false);
                        break;
            }
            $position += 1;
        }
    }

    private function verifyIfBadgeExistsInTheApplication($application, $badge_description){
        $veirfy_badge = ClassBadgesStudent::where('fk_class_id',$application->fk_class_id)
            ->where('fk_evaluation_aplication_id', $application->id)
            ->where('description_id', $badge_description)
            ->first();
        if($veirfy_badge) return true;

        return false;
    }

    private function saveBadgeParameter($badge_obj, $id_class, $id_badge, $parameter, $id_user){
        //recebe o objeto badge por parametro, caso não exista cria um novo
        $badge = $badge_obj;
        if(!$badge){
            $badge = new ClassBadgesParameters();
        }

        $badge->fk_user_id = $id_user;
        $badge->fk_class_id = $id_class;
        $badge->description_id = $id_badge;
        $badge->parameter = $parameter;
        $badge->save();
    }

    private function saveTheBadge($id_badge, $id_class, $id_user, $id_application, $verifyIfExists){
        //verifica se o badge já  existe
        $verify = ClassBadgesStudent::where('description_id', $id_badge)
            ->where('fk_class_id', $id_class)
            ->where('fk_user_id', $id_user)->first();
        //se o badge já existe, encerra a função
        if($verify && $verifyIfExists){
            return null;
        }

        //salva o badge do estudante
        $badge_student = new ClassBadgesStudent();
        $badge_student->description_id = $id_badge;
        $badge_student->fk_class_id = $id_class;
        $badge_student->fk_user_id = $id_user;
        if($id_application){
            /*
                Verifica se possui simulado para associar
            */
            $badge_student->fk_evaluation_aplication_id = $id_application;
        }
        $badge_student->save();

        $badge_student = ClassBadgesStudent::where('id', $badge_student->id)
            ->with('badgesSettings')
            ->with('classQuestione')
            ->with('badgesSettings')->first();
        //notifica os usuários
        event(new BadgesNotifications($badge_student));

        //dá pontuação do badge
        $pointSystem = new PointSystemController();
        $pointSystem->RPpointBadgeCredit($id_badge, $id_class, null, null);

    }

    private function isGamified($id_class){
        $result = false;

        $class = ClassQuestione::where('id', $id_class)->first();

        if($class){
            $result = $class->gamified_class == 1;
        }

        return $result;
    }
}
