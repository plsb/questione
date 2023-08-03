<?php

namespace App\Http\Controllers;

use App\AnswersEvaluation;
use App\AnswersHeadEvaluation;
use App\ClassGamificationSettings;
use App\RPPoints;
use App\XPPoints;
use Validator;

class PointSystem extends Controller
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

        return $XPpoint;
    }

    public function RPpointCredit($descriptionID, $id_class, $id_answersHead, $id_answer)
    {
        $user = auth('api')->user();

        $settings = ClassGamificationSettings::where('description_id', $descriptionID)
            ->where('fk_class_id', $id_class)->first();

        $RPpoint = new RPPoints();
        $RPpoint->description_id = $settings->description_id;
        $RPpoint->point = $settings->RP;
        $RPpoint->type = 'C';
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
}
