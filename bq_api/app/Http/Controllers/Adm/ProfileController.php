<?php

namespace App\Http\Controllers\Adm;

use App\Course;
use App\Profile;
use App\Question;
use Illuminate\Http\Request;
use Validator;
use App\Http\Controllers\Controller;

class ProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkAdm']);
    }

    private $rules = [
        'description' => 'required|max:300|min:10',
        'fk_course_id' => 'required',

    ];

    private $messages = [
        'description.required' => 'A DESCRIÇÃO é obrigatória.',
        'description.max' => 'O máximo de caracteres aceitáveis para a DESCRIÇÃO é 300.',
        'description.min' => 'O minímo de caracteres aceitáveis para a DESCRIÇÃO é 10.',

        'fk_course_id.required' => 'O CURSO é obrigatório.',

    ];

    public function index(Request $request)
    {
        if($request->fk_course_id)
        {
            $profiles = Profile::where('fk_course_id', '=', $request->fk_course_id)
                ->orderBy('description')
                ->with('course')
                ->paginate(10);
        } else {
            $profiles = Profile::orderBy('fk_course_id')->with('course')->paginate(10);
        }
        return response()->json($profiles, 200);
    }

    public function store(Request $request)
    {
        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            return $validation->errors()->toJson();
        }

        if(!$this->verifyCourse($request->fk_course_id)){
            return response()->json([
                'message' => 'Curso não encontrado.'
            ], 202);
        }

        $profile = new Profile();
        $profile->description = $request->description;
        $profile->fk_course_id = $request->fk_course_id;
        $profile->save();

        return response()->json([
            'message' => 'Perfil '.$profile->description.' cadastrado.',
            $profile
        ], 200);
    }

    public function show(int $id)
    {
        $profile = Profile::where('id', '=', $id)->with('course')->get();

        $this->verifyRecord($profile);

        return response()->json($profile, 200);
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

        if(!$this->verifyCourse($request->fk_course_id)){
            return response()->json([
                'message' => 'Perfil não encontrado.'
            ], 202);
        }

        $profile = Profile::find($id);

        $this->verifyRecord($profile);

        $profile->description = $request->description;
        $profile->fk_course_id = $request->fk_course_id;
        $profile->save();


        return response()->json([
            'message' => 'Perfil '.$profile->description.' atualizado.',
            $profile
        ], 200);

    }

    public function destroy($id)
    {
        $profile = Profile::find($id);

        $this->verifyRecord($profile);

        $questions = Question::where('fk_profile_id', '=', $id)->get();
        if(sizeof($questions)>0) {
            return response()->json(['message' => 'Operação não realizada. Existem questões para este perfil.'], 202);
        }

        $profile->delete();

        return response()->json([
            'message' => 'Perfil '.$profile->description.' excluído!'
        ], 200);
    }

    public function verifyRecord($record){
        if(!$record || $record == '[]'){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 202);
        }
    }

    private function verifyCourse($id){
        $course = Course::find($id);

        if(!$course){
            return false;
        }
        return true;
    }
}
