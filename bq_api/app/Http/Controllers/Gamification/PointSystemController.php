<?php

namespace App\Http\Controllers\Gamification;

use App\AnswersEvaluation;
use App\AnswersHeadEvaluation;
use App\ClassBadgesSettings;
use App\ClassGamificationSettings;
use App\ClassQuestione;
use App\Http\Controllers\Controller;
use App\RPPoints;
use App\XPPoints;
use Validator;

class PointSystemController extends Controller
{

    public function __construct()
    {
        //$this->middleware(['cors']);
    }

    public function XPpoint($descriptionID, $id_class, $id_answersHead, $id_answer)
    {
        $user = auth('api')->user();

        $settings = ClassGamificationSettings::where('description_id', $descriptionID)
            ->where('fk_class_id', $id_class)->first();

        $XPpoint = new XPPoints();
        $XPpoint->description_id = $settings->description_id;
        $XPpoint->point = $settings->XP;
        $XPpoint->fk_class_id = $settings->fk_class_id;
        $XPpoint->fk_user_id = $user->id;
        if($id_answersHead){
            $answersHead = AnswersHeadEvaluation::where('id', $id_answersHead)->first();
            if($answersHead) {
                $XPpoint->fk_answers_head_id = $answersHead->id;
            }
        }
        if($id_answer){
            $answer = AnswersEvaluation::where('id', $id_answer)->first();
            if($answer){
                $XPpoint->fk_answers_id = $answer->id;
            }
        }

        $XPpoint->save();

        //verifica se tem direito a um badge
        $badge = new BadgesController();
        $badge->get100XP($settings->fk_class_id);

        return $XPpoint;
    }

    public function RPpoint($descriptionID, $id_class, $id_answersHead, $id_answer, $user_for_pontuation, $type='C')
    {
        $user = auth('api')->user();
        if($user_for_pontuation){
            $user = $user_for_pontuation;
        }

        $class = ClassQuestione::where('id', $id_class)->first();
        if($class->gamified_class == 0 && !$user_for_pontuation){
            return ;
        }

        $settings = ClassGamificationSettings::where('description_id', $descriptionID)
            ->where('fk_class_id', $id_class)->first();

        $RPpoint = new RPPoints();
        $RPpoint->description_id = $settings->description_id;
        $RPpoint->point = $settings->RP;
        $RPpoint->type = $type;
        $RPpoint->fk_class_id = $settings->fk_class_id;
        $RPpoint->fk_user_id = $user->id;
        if($id_answersHead){
            $answersHead = AnswersHeadEvaluation::where('id', $id_answersHead)->first();
            if($answersHead) {
                $RPpoint->fk_answers_head_id = $answersHead->id;
            }
        }
        if($id_answer){
            $answer = AnswersEvaluation::where('id', $id_answer)->first();
            if($answer){
                $RPpoint->fk_answers_id = $answer->id;
            }
        }

        $RPpoint->save();

        return $RPpoint;
    }

    public function RPpointBadgeCredit($descriptionIDBadge, $id_class, $id_answersHead, $id_answer)
    {
        $user = auth('api')->user();

        $badge_settings = ClassBadgesSettings::where('description_id', $descriptionIDBadge)
            ->where('fk_class_id', $id_class)->first();

        $RPpoint = new RPPoints();
        $RPpoint->description_id = 'get_badge';
        $RPpoint->point = $badge_settings->RP;
        $RPpoint->type = 'C';
        $RPpoint->fk_class_id = $id_class;
        $RPpoint->fk_user_id = $user->id;
        if($id_answersHead){
            $answersHead = AnswersHeadEvaluation::where('id', $id_answersHead)->first();
            if($answersHead) {
                $RPpoint->fk_answers_head_id = $answersHead->id;
            }
        }
        if($id_answer){
            $answer = AnswersEvaluation::where('id', $id_answer)->first();
            if($answer){
                $RPpoint->fk_answers_id = $answer->id;
            }
        }

        $RPpoint->save();

        return $RPpoint;
    }
}
