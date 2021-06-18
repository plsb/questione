<?php

namespace App\Http\Controllers\Adm;

use App\Course;
use App\Question;
use Illuminate\Http\Request;
use Validator;
use App\Http\Controllers\Controller;

class CourseController extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkAdm']);
    }

    private $rules = [
        'initials' => 'required|max:8|min:2',
        'description' => 'required|max:100|min:4',

    ];

    private $messages = [
        'initials.required' => 'A SILGA é obrigatória.',
        'initials.max' => 'O máximo de caracteres aceitáveis para a SIGLA é 08.',
        'initials.min' => 'O minímo de caracteres aceitáveis para a SIGLA é 02.',

        'description.required' => 'A DESCRIÇÃO é obrigatório.',
        'description.max' => 'O máximo de alfanuméricos aceitáveis para a DESCRIÇÃO é 100.',
        'description.min' => 'O minímo de alfanuméricos aceitáveis para a DESCRIÇÃO é 04.',

    ];

    public function index(Request $request)
    {
        if($request->description){
            $courses = Course::where('description', 'like', '%'.$request->description.'%')
                ->orderBy('description')
                ->paginate(10);
        } else {
            $courses = Course::orderBy('description')->paginate(10);
        }

        return response()->json($courses, 200);
    }

    public function store(Request $request)
    {
        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        $course = new Course();
        $course->initials = $request->initials;
        $course->description = $request->description;
        $course->save();

        return response()->json([
            'message' => 'Curso '.$course->description.' cadastrado.',
            $course
        ], 200);
    }

    public function show(int $id)
    {
        $course = Course::find($id);

        $this->verifyRecord($course);

        return response()->json($course, 200);
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

        $course = Course::find($id);

        $this->verifyRecord($course);

        $course->initials = $request->initials;
        $course->description = $request->description;
        $course->save();

        return response()->json([
            'message' => 'Curso '.$course->description.' atualizado.',
            $course
        ], 200);
    }

    public function destroy($id)
    {
        $course = Course::find($id);

        $this->verifyRecord($course);

        $questions = Question::where('fk_course_id', '=', $id)->get();
        if(sizeof($questions)>0) {
            return response()->json(['message' => 'Operação não realizada. Existem questões para este curso.'], 202);
        }

        $course->delete();

        return response()->json([
            'message' => 'Curso '.$course->description.' excluído.',
            $course
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
