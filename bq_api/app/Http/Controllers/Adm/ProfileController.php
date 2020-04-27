<?php

namespace App\Http\Controllers\Adm;

use App\Course;
use App\Profile;
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
        if(!$request->fk_course_id)
        {
            return response()->json([
                'message' => 'Informe o Curso.'
            ], 200);
        }
        $profiles = Profile::where('fk_course_id', '=', $request->fk_course_id)->orderBy('id')->with('course')->paginate(10);
        return response()->json($profiles);
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
            ], 404);
        }

        $profile = new Profile();
        $profile->description = $request->description;
        $profile->fk_course_id = $request->fk_course_id;
        $profile->save();

        return response()->json($profile, 201);
    }

    public function show(int $id)
    {
        $profile = Profile::where('id', '=', $id)->with('course')->get();

        $this->verifyRecord($profile);

        return response()->json($profile);
    }

    public function update(Request $request, $id)
    {
        $validation = Validator::make($request->all(), $this->rules, $this->messages);

        if($validation->fails()){
            return $validation->errors()->toJson();
        }

        if(!$this->verifyCourse($request->fk_course_id)){
            return response()->json([
                'message' => 'Curso não encontrado.'
            ], 404);
        }

        $profile = Profile::find($id);

        $this->verifyRecord($profile);

        $profile->description = $request->description;
        $profile->fk_course_id = $request->fk_course_id;
        $profile->save();


        return response()->json($profile);

    }

    public function destroy($id)
    {
        $profile = Profile::find($id);

        $this->verifyRecord($profile);

        $profile->delete();

        return response()->json([
            'message' => 'Perfil '.$profile->description.' excluído!'
        ], 202);
    }

    public function search(Request $request)
    {
        if(!$request->fk_course_id)
        {
            return response()->json([
                'message' => 'Informe o Curso.'
            ], 200);
        }

        $profile = Profile::where('description', 'like', '%'.$request->description.'%')
            ->where('fk_course_id', '=', $request->fk_course_id)
            ->with('course')
            ->paginate(10);


        $this->verifyRecord($profile);

        return response()->json($profile, 200);

    }

    public function verifyRecord($record){
        if(!$record || $record == '[]'){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 404);
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
