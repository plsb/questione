<?php

namespace App\Http\Controllers\Adm;

use App\Question;
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
        if($request->fk_course_id)
        {
            $skills = Skill::where('fk_course_id', '=', $request->fk_course_id)
                ->orderBy('description')
                ->with('course')
                ->paginate(10);
        } else {
            $skills = Skill::orderBy('fk_course_id')->with('course')->paginate(10);
        }

        return response()->json($skills, 200);
    }

    public function store(Request $request)
    {
        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            return $validation->errors()->toJson();
        }

        if(!$this->verifyCourse($request->fk_course_id)){
            return response()->json([
                'message' => 'Competência não encontrada.'
            ], 202);
        }

        $skill = new Skill();
        $skill->description = $request->description;
        $skill->fk_course_id = $request->fk_course_id;
        $skill->save();

        return response()->json([
            'message' => 'Competência '.$skill->description.' cadastrada.',
            $skill
        ], 200);
    }

    public function show(int $id)
    {
        $skill = Skill::where('id', '=', $id)->with('course')->get();

        $this->verifyRecord($skill);

        return response()->json($skill, 200);
    }

    public function update(Request $request, $id)
    {
        $validation = Validator::make($request->all(), $this->rules, $this->messages);

        if($validation->fails()){
            return $validation->errors()->toJson();
        }

        if(!$this->verifyCourse($request->fk_course_id)){
            return response()->json([
                'message' => 'Comepetência não encontrada.'
            ], 202);
        }

        $skill = Skill::find($id);

        $this->verifyRecord($skill);

        $skill->description = $request->description;
        $skill->fk_course_id = $request->fk_course_id;
        $skill->save();


        return response()->json([
            'message' => 'Comepetência '.$skill->description.' atualizada.',
            $skill
        ], 200);

    }

    public function destroy($id)
    {
        $skill = Skill::find($id);

        $this->verifyRecord($skill);

        $questions = Question::where('fk_skill_id', '=', $id)->get();
        if(sizeof($questions)>0) {
            return response()->json(['message' => 'Operação não realizada. Existem questões para esta competência.'], 202);
        }

        $skill->delete();

        return response()->json([
            'message' => 'Competência '.$skill->description.' excluída!'
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
