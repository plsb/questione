<?php

namespace App\Http\Controllers\Adm;

use App\Skill;
use Illuminate\Http\Request;
use Validator;
use App\Course;
use App\Http\Controllers\Controller;

class SkillController extends Controller
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
        $skills = Skill::where('fk_course_id', '=', $request->fk_course_id)->orderBy('id')->with('course')->paginate(10);
        return response()->json($skills);
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

        $skill = new Skill();
        $skill->description = $request->description;
        $skill->fk_course_id = $request->fk_course_id;
        $skill->save();

        return response()->json($skill, 201);
    }

    public function show(int $id)
    {
        $skill = Skill::where('id', '=', $id)->with('course')->get();

        $this->verifyRecord($skill);

        return response()->json($skill);
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

        $skill = Skill::find($id);

        $this->verifyRecord($skill);

        $skill->description = $request->description;
        $skill->fk_course_id = $request->fk_course_id;
        $skill->save();


        return response()->json($skill);

    }

    public function destroy($id)
    {
        $skill = Skill::find($id);

        $this->verifyRecord($skill);

        $skill->delete();

        return response()->json([
            'message' => 'Competência '.$skill->description.' excluída!'
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

        $skill = Skill::where('description', 'like', '%'.$request->description.'%')
            ->where('fk_course_id', '=', $request->fk_course_id)
            ->with('course')
            ->paginate(10);


        $this->verifyRecord($skill);

        return response()->json($skill, 200);

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
