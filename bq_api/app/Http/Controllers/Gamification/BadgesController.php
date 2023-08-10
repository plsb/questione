<?php

namespace App\Http\Controllers\Gamification;

use App\AnswersEvaluation;
use App\AnswersHeadEvaluation;
use App\ClassBadgesParameters;
use App\ClassBadgesSettings;
use App\ClassBadgesStudent;
use App\ClassGamificationSettings;
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
        $id_badge = 'get_100_xp';

        $user = auth('api')->user();

        $controller = new ClassGamificationStudentController();
        $totalXP = $controller->totalXP($id_class);

        if($totalXP->original >= 100){
            $verify = ClassBadgesStudent::where('fk_class_id', $id_class)
                ->where('fk_user_id', $user->id)
                ->where('description_id', $id_badge)->first();

            if(!$verify){ //verifica se o estudante já tem o badge caso não, adiciona
                $badge_student = new ClassBadgesStudent();
                $badge_student->description_id = $id_badge;
                $badge_student->fk_class_id = $id_class;
                $badge_student->fk_user_id = $user->id;
                $badge_student->save();

                //dá pontuação do badge
                $pointSystem = new PointSystemController();
                $pointSystem->RPpointBadgeCredit($id_badge, $id_class, null, null);

            }

        }
    }

    public function fiveCorrectQuestions($id_class){

        $id_badge = 'five_correct_questions';

        $user = auth('api')->user();

        $verify = ClassBadgesParameters::where('fk_class_id', $id_class)
            ->where('fk_user_id', $user->id)
            ->where('description_id', $id_badge)->first();

        if(!$verify){
            $badge_param = new ClassBadgesParameters();
            $badge_param->fk_user_id = $user->id;
            $badge_param->fk_class_id = $id_class;
            $badge_param->description_id = $id_badge;
            $badge_param->parameter = 1;
            $badge_param->save();
        } else if($verify->parameter < 5){
            $badge_param = $verify;
            $badge_param->fk_user_id = $user->id;
            $badge_param->fk_class_id = $id_class;
            $badge_param->description_id = $id_badge;
            $badge_param->parameter = $badge_param->parameter + 1;
            $badge_param->save();

            if($badge_param->parameter == 5){
                $badge_student = new ClassBadgesStudent();
                $badge_student->description_id = $id_badge;
                $badge_student->fk_class_id = $id_class;
                $badge_student->fk_user_id = $user->id;
                $badge_student->save();

                //dá pontuação do badge
                $pointSystem = new PointSystemController();
                $pointSystem->RPpointBadgeCredit($id_badge, $id_class, null, null);

            }
        }
    }

    public function tenCorrectQuestions($id_class){

        $id_badge = 'ten_correct_questions';

        $user = auth('api')->user();

        $verify = ClassBadgesParameters::where('fk_class_id', $id_class)
            ->where('fk_user_id', $user->id)
            ->where('description_id', $id_badge)->first();

        if(!$verify){
            $badge_param = new ClassBadgesParameters();
            $badge_param->fk_user_id = $user->id;
            $badge_param->fk_class_id = $id_class;
            $badge_param->description_id = $id_badge;
            $badge_param->parameter = 1;
            $badge_param->save();
        } else if($verify->parameter < 2){
            $badge_param = $verify;
            $badge_param->fk_user_id = $user->id;
            $badge_param->fk_class_id = $id_class;
            $badge_param->description_id = $id_badge;
            $badge_param->parameter = $badge_param->parameter + 1;
            $badge_param->save();

            if($badge_param->parameter == 2){
                $badge_student = new ClassBadgesStudent();
                $badge_student->description_id = $id_badge;
                $badge_student->fk_class_id = $id_class;
                $badge_student->fk_user_id = $user->id;
                $badge_student->save();

                //dá pontuação do badge
                $pointSystem = new PointSystemController();
                $pointSystem->RPpointBadgeCredit($id_badge, $id_class, null, null);

            }
        }
    }

    public function correctlyAnswerTwoSimulations($id_class){
        //Acertar completamente dois simulados
        $id_badge = 'correctly_answer_two_simulations';

        $user = auth('api')->user();

        $verify = ClassBadgesParameters::where('fk_class_id', $id_class)
            ->where('fk_user_id', $user->id)
            ->where('description_id', $id_badge)->first();

        if(!$verify){
            $badge_param = new ClassBadgesParameters();
            $badge_param->fk_user_id = $user->id;
            $badge_param->fk_class_id = $id_class;
            $badge_param->description_id = $id_badge;
            $badge_param->parameter = 1;
            $badge_param->save();
        } else if($verify->parameter < 2){
            $badge_param = $verify;
            $badge_param->fk_user_id = $user->id;
            $badge_param->fk_class_id = $id_class;
            $badge_param->description_id = $id_badge;
            $badge_param->parameter = $badge_param->parameter + 1;
            $badge_param->save();

            if($badge_param->parameter == 2){
                $badge_student = new ClassBadgesStudent();
                $badge_student->description_id = $id_badge;
                $badge_student->fk_class_id = $id_class;
                $badge_student->fk_user_id = $user->id;
                $badge_student->save();

                //dá pontuação do badge
                $pointSystem = new PointSystemController();
                $pointSystem->RPpointBadgeCredit($id_badge, $id_class, null, null);

            }
        }

    }

    public function answerATestSameDayWasPosted($id_class, $id_head){
        //Responder um simulado no mesmo dia que foi publicado
        $user = auth('api')->user();

        $head = AnswersHeadEvaluation::where('fk_user_id', $user->id)
            ->whereNotNull('finalized_at')->first();

        if($head){
            $application = EvaluationApplication::where('id', $head->fk_application_evaluation_id)->first();
            if($application){

            }
        }



    }
}
