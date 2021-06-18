<?php

namespace App\Http\Controllers;

use App\Evaluation;
use App\Question;
use App\User;
use Validator;

class FuncionalitiesPublics extends Controller
{

    public function totalQuestionsValid()
    {
        $questions = Question::where('validated', 1)->count();

        return response()->json($questions, 200);
    }

    public function totalProfessors()
    {
        $users = User::where('acess_level', 2)->count();

        return response()->json($users, 200);
    }

    public function totalStudents()
    {
        $users = User::where('acess_level', 0)->count();

        return response()->json($users, 200);
    }

    public function totalEvaluations()
    {
        $evaluation = Evaluation::all()->count();

        return response()->json($evaluation, 200);
    }


}
