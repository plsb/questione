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
                $this->saveTheBadge($id_badge, $id_class, $user->id);

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
            $this->saveBadgeParameter(null, $id_class, $id_badge, $parameter, $user->id);

            if($parameter == $value_parameter_max){
                $this->saveTheBadge($id_badge, $id_class, $user->id);

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
            $this->saveBadgeParameter(null, $id_class, $id_badge, $parameter, $user->id);

            if($parameter == $value_parameter_max){
                $this->saveTheBadge($id_badge, $id_class, $user->id);
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
            $this->saveBadgeParameter(null, $id_class, $id_badge, $parameter, $user->id);

            if($parameter == $value_parameter_max){
                $this->saveTheBadge($id_badge, $id_class, $user->id);
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
                    $this->saveTheBadge($id_badge, $id_class, $user->id);
                }

            }
        }

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

    private function saveTheBadge($id_badge, $id_class, $id_user){
        //verifica se o badge já  existe
        $verify = ClassBadgesStudent::where('description_id', $id_badge)
            ->where('fk_class_id', $id_class)
            ->where('fk_user_id', $id_user)->first();
        //se o badge já existe, encerra a função
        if($verify){
            return null;
        }

        //salva o badge do estudante
        $badge_student = new ClassBadgesStudent();
        $badge_student->description_id = $id_badge;
        $badge_student->fk_class_id = $id_class;
        $badge_student->fk_user_id = $id_user;
        $badge_student->save();

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
