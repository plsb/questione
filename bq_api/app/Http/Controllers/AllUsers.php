<?php

namespace App\Http\Controllers;

use App\Course;
use App\CourseProfessor;
use App\KnowledgeObject;
use App\Skill;
use Illuminate\Http\Request;
use Validator;

class AllUsers extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth']);
    }

    public function courses()
    {
        $courses = Course::orderBy('description')->get();

        return response()->json($courses, 200);
    }

    public function skills(Request $request)
    {
        if(!$request->fk_course_id){
            return response()->json([
                'message' => 'Informe o curso.'
            ], 202);
        }
        $skill = Skill::where('fk_course_id', $request->fk_course_id)
            ->orderBy('description')
            ->get();

        return response()->json($skill, 200);
    }

    public function knowledgeObjects(Request $request)
    {
        if(!$request->fk_course_id){
            return response()->json([
                'message' => 'Informe o curso.'
            ], 202);
        }
        $objects = KnowledgeObject::where('fk_course_id', $request->fk_course_id)
            ->orderBy('description')
            ->get();

        return response()->json($objects, 200);
    }

    private $rulesUser = [
        'name' => 'required|max:50|min:8'
    ];

    private $messagesUser = [
        'name.required' => 'O NOME DO USUÁRIO é obrigatório.',
        'name.max' => 'O máximo de caracteres aceitáveis para o NOME DO USUÁRIO é 50.',
        'name.min' => 'O minímo de caracteres aceitáveis para o NOME DO USUÁRIO é 8.',
    ];

    public function updateProfileUser(Request $request)
    {
        $validation = Validator::make($request->all(),$this->rulesUser, $this->messagesUser);

        if($validation->fails()){
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        $user = auth('api')->user();
        $user->name = strtoupper($request->name);
        $user->save();

        return response()->json([
            'message' => 'Usuário atualizado.',
            $user
        ], 200);
    }

    public function coursesUser(){
        $user = auth('api')->user();
        $courses_user = CourseProfessor::where('fk_user_id', $user->id)
            ->where('valid', 1)->get();
        $arr = array();
        foreach ($courses_user as $courses_u){
            //dd($enaq);
            $arr[] = $courses_u->fk_course_id;
        }
        //dd($courses_user);
        $courses = Course::whereIn('id', $arr)->get();
        return response()->json($courses, 202);
    }
}
