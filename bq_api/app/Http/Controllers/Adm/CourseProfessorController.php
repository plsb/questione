<?php

namespace App\Http\Controllers\Adm;

use App\Course;
use App\CourseProfessor;
use App\Notifications\RequestCourseProfessorNotifications;
use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;

class CourseProfessorController extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkAdm']);
    }

    private $rules = [
        'valid' => 'required',

    ];

    private $messages = [
        'valid.required' => 'A SITUAÇÃO é obrigatória.',
    ];

    public function index(Request $request)
    {
        /*
         * 0 - VALIDAÇÃO PENDENTE
         * 1 - ACEITO
         * 2 - RECUSADO
         */
        $valid = $request->valid;
        if($valid != null){
            $coursesProfessor = CourseProfessor::where('valid', '=', $request->valid)
                                                    ->orderBy('created_at', 'DESC')
                                                    ->with('user')
                                                    ->with('course')
                                                    ->paginate(10);
        } else {
            $coursesProfessor = CourseProfessor::orderBy('created_at', 'DESC')
                                                    ->with('user')
                                                    ->with('course')
                                                    ->paginate(10);
        }
        return response()->json($coursesProfessor, 200);
    }

    public function show(int $id)
    {
        $courseProfessor = CourseProfessor::where('id',$id)
            ->with('user')
            ->with('course')
            ->get();

        $this->verifyRecord($courseProfessor);

        return response()->json($courseProfessor, 200);
    }

    public function update(Request $request, $id)
    {
        $validation = Validator::make($request->all(), $this->rules, $this->messages);

        if($validation->fails()){
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        $courseProfessor = CourseProfessor::find($id);

        $this->verifyRecord($courseProfessor);

        $courseProfessor->valid = $request->valid;
        $courseProfessor->save();

        //notifica por e-mail
        $user = User::where('id',$courseProfessor->fk_user_id)->first();;
        $course = Course::where('id',$courseProfessor->fk_course_id)->first();
        $situaton = "";
        if($request->valid == 0){
            $situaton = "AGUARDANDO";
        } else if($request->valid == 1){
            $situaton = "APROVADA";
        } else if($request->valid == 0){
            $situaton = "RECUSADA";
        }
        $description = $course->description;
        //dd($description, $situaton);
        $user->notify(
            new RequestCourseProfessorNotifications($user, $description, $situaton)
        );

        return response()->json([
            'message' => 'Estado da solicitação atualizado.',
            $courseProfessor
        ], 200);
    }

    public function verifyRecord($record){
        if(!$record || $record == '[]'){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 202);
        }
    }

}
