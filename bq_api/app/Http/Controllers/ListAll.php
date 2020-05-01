<?php

namespace App\Http\Controllers;

use App\Course;
use Validator;

class ListAll extends Controller
{
    public function courses()
    {
        $courses = Course::orderBy('description')->get();

        return response()->json($courses, 200);
    }
}
