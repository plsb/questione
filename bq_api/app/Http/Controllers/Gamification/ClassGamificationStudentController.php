<?php

namespace App\Http\Controllers\Gamification;

use App\ClassQuestione;
use App\ClassStudents;
use App\Http\Controllers\Controller;
use App\RPPoints;
use App\XPPoints;
use Validator;

class ClassGamificationStudentController extends Controller
{
    public function totalXP(int $idclass){
        $user = auth('api')->user();

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

    public function rankPosition(int $idclass){
        $user = auth('api')->user();

        if(!$this->checkClass($idclass)){
            return response()->json([
                'message' => 'Turma não encontrada.'
            ], 202);
        }

        $class_students = ClassStudents::where('fk_class_id', $idclass)->get();

        $array_rank = array();
        foreach ($class_students as $item){
            $xp = XPPoints::where('fk_class_id', $idclass)
                ->where('fk_user_id', $item->fk_user_id)->sum('point');
            $result = (object)[
                'xp' => $xp,
                'user' => $item->fk_user_id,
            ];
            $array_rank[] = $result;
        }
        rsort($array_rank); //reordena a lista

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

        $rp_total = $rp_credit - $rp_debit;

        return response()->json($rp_total, 200);

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
