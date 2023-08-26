<?php

namespace App\Http\Controllers\Adm;

use App\Question;
use App\Regulation;
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
        'fk_regulation_id' => 'required',

    ];

    private $messages = [
        'description.required' => 'A DESCRIÇÃO é obrigatória.',
        'description.max' => 'O máximo de caracteres aceitáveis para a DESCRIÇÃO é 300.',
        'description.min' => 'O minímo de caracteres aceitáveis para a DESCRIÇÃO é 10.',

        'fk_regulation_id.required' => 'A PORTARIA é obrigatória.',

    ];

    public function index(Request $request)
    {
        if($request->fk_course_id)
        {
            $id_regulation = $request->fk_regulation_id;
            $skills = Skill::where('fk_course_id', '=', $request->fk_course_id)
                ->when($id_regulation, function ($query, $id_regulation) {
                    //pega questões validadas de todos os usuário
                    return $query->where('fk_regulation_id', '=', $id_regulation);
                })
                ->orderBy('description')
                ->with('course')
                ->with('regulation')
                ->paginate(10);
        } else {
            $skills = Skill::orderBy('fk_course_id')
                ->with('course')
                ->with('regulation')
                ->paginate(10);
        }

        return response()->json($skills, 200);
    }

    public function store(Request $request)
    {
        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            return $validation->errors()->toJson();
        }

        $regulation = $this->verifyRegulation($request->fk_regulation_id);
        if(!$regulation){
            return response()->json([
                'message' => 'Portaria não encontrada.'
            ], 202);
        }

        $skill = new Skill();
        $skill->description = $request->description;
        $skill->fk_regulation_id = $request->fk_regulation_id;

        $skill->fk_course_id = $regulation->fk_course_id;
        $skill->save();

        return response()->json([
            'message' => 'Competência '.$skill->description.' cadastrada.',
            $skill
        ], 200);
    }

    public function show(int $id)
    {
        $skill = Skill::where('id', '=', $id)
            ->with('course')
            ->with('regulation')
            ->get();

        return response()->json($skill, 200);
    }

    public function update(Request $request, $id)
    {
        $validation = Validator::make($request->all(), $this->rules, $this->messages);

        if($validation->fails()){
            return $validation->errors()->toJson();
        }

        $regulation = $this->verifyRegulation($request->fk_regulation_id);
        if(!$regulation){
            return response()->json([
                'message' => 'Portaria não encontrada.'
            ], 202);
        }

        $skill = Skill::find($id);

        $this->verifyRecord($skill);

        $skill->description = $request->description;
        $skill->fk_regulation_id = $request->fk_regulation_id;

        $skill->fk_course_id = $regulation->fk_course_id;
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

    private function verifyRegulation($id){
        $regulation = Regulation::find($id);

        return $regulation;
    }
}
