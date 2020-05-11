<?php

namespace App\Http\Controllers;

use App\Course;
use App\CourseProfessor;
use App\Notifications\RequestCourseProfessorToAdmNotifications;
use App\User;
use Illuminate\Http\Request;
use Validator;

class UserCourseProfessorController extends Controller
{
    private $rules = [
        'fk_course_id' => 'required',
        'receipt' => 'required',

    ];

    private $messages = [
        'fk_course_id.required' => 'O CURSO é obrigatório.',
    ];

    public function __construct()
    {
        $this->middleware(['jwt.auth']);
    }

    public function index(Request $request)
    {
        $user = auth('api')->user();

        $cp = CourseProfessor::where('fk_user_id',$user->id)
            ->orderBy('created_at','DESC')
            ->with('user')
            ->with('course')
            ->paginate(10);

        return response()->json($cp, 200);
    }

    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), $this->rules, $this->messages);

        if ($validation->fails()) {
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        $course_verify = Course::where('id', $request->fk_course_id)->get();

        if (sizeof($course_verify)==0) {
            return response()->json([
                'message' => 'Curso não foi encontrado.'
            ], 202);
        }

        $user = auth('api')->user();

        $course_professor_verify = CourseProfessor::where('fk_user_id', $user->id)
            ->where('fk_course_id', $request->fk_course_id)->get();

        if (sizeof($course_professor_verify)>0) {
            return response()->json([
                'message' => 'Solicitação já foi cadastrada.'
            ], 202);
        }

        $file = $request->file('receipt');

        if (!$file) {
            return response()->json([
                'message' => 'O comprovante não é válido.'
            ], 202);
        }

        if($request->receipt->extension() != 'pdf'){
            return response()->json([
                'message' => 'Informe um comprovante no formato pdf.'
            ], 202);
        }
        $name_receipt = 'U:'.$user->id.'_C:'.$request->fk_course_id.'.pdf';
        $upload = $request->receipt->storeAs('receipt_professor',
            $name_receipt, 'public');

        $course_professor = new CourseProfessor();
        $course_professor->fk_user_id = $user->id;
        $course_professor->fk_course_id = $request->fk_course_id;
        $course_professor->valid = 0;
        $course_professor->receipt = $name_receipt;
        $course_professor->save();

        //notifica por e-mail
        $course = Course::where('id',$request->fk_course_id)->first();

        $user_adm = User::find(2);
        //$user_adm->email = 'pedro.barbosa@ifce.edu.br';

        $description = $course->description;
        $user_adm->notify(
            new RequestCourseProfessorToAdmNotifications($user, $description)
        );

        return response()->json([
            'message' => 'Solicitação cadastrada.',
            $course_professor
        ], 200);
    }


}
