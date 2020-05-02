<?php

namespace App\Http\Controllers\Professor;

use App\Course;
use App\Profile;
use App\Question;
use App\QuestionHasKnowledgeObject;
use App\QuestionItem;
use App\Skill;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;

class QuestionController extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkProfessor']);
    }

    private $rules = [
        'base_text' => 'required',
        'stem' => 'required',
        'fk_course_id' => 'required',

    ];

    private $messages = [
        'description.required' => 'A DESCRIÇÃO é obrigatória.',
        'stem.required' => 'O ENUNCIADO é obrigatório.',

        'fk_course_id.required' => 'O CURSO é obrigatório.',

    ];

    public function index()
    {
        //retorna todas as questões do usuário ativo
        $user = auth('api')->user();

        $questions = Question::where('fk_user_id', '=', $user->id)
            ->orderBy('id')
            ->with('course')
            ->with('profile')
            ->with('skill')
            ->with('knowledgeObjects')
            ->with('user')
            ->with('questionItems')
            ->paginate(10);
        return response()->json($questions, 200);
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

        $course = Course::find($request->fk_course_id);
        if(!$course){
            return response()->json([
                'message' => 'Curso não encontrado.'
            ], 202);
        }
        //verifica perfil
        if($request->fk_profile_id){
            $profile = Profile::find($request->fk_profile_id);
            if(!$profile){
                return response()->json([
                    'message' => 'Perfil não encontrado.'
                ], 202);
            }
            if($profile->fk_course_id != $course->id){
                return response()->json([
                    'message' => 'Operação não permitida. O perfil não pertence ao curso informado.'
                ], 202);
            }
        }
        //verifica competência
        if($request->fk_skill_id){
            $skill = Skill::find($request->fk_skill_id);
            if(!$skill){
                return response()->json([
                    'message' => 'Competência não encontrada.'
                ], 202);
            }
            if($skill->fk_course_id != $course->id){
                return response()->json([
                    'message' => 'Operação não permitida. A Competência não pertence ao curso informado.'
                ], 202);
            }
        }

        $user = auth('api')->user();

        $question = new Question();
        $question->base_text = $request->base_text;
        $question->stem = $request->stem;
        $question->validated = 0;
        $question->reference = $request->reference;
        $question->fk_profile_id = $request->fk_profile_id;
        $question->fk_skill_id = $request->fk_skill_id;
        $question->fk_user_id = $user->id;
        $question->fk_course_id = $request->fk_course_id;
        $question->save();

        return response()->json([
            'message' => 'Questão '.$question->id.' cadastrada.',
            $question
        ], 200);
    }

    public function show(int $id)
    {
        $question = Question::where('id', '=', $id)
            ->with('course')
            ->with('profile')
            ->with('skill')
            ->with('knowledgeObjects')
            ->with('user')
            ->with('questionItems')
            ->get();

        $this->verifyRecord($question);

        return response()->json($question, 200);
    }

    public function update(Request $request, $id)
    {
        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        $user = auth('api')->user();
        $question = Question::find($id);

        if($question->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Acesso não permitido para esta questão.'
            ], 202);
        }

        if($question->validated == 1){
            //falta colocar validacao se a questão já tiver sido aplicada em uma avaliacao
            return response()->json([
                'message' => 'A questão não pode ser editada.'
            ], 202);
        }

        $course = Course::find($request->fk_course_id);
        if(!$course){
            return response()->json([
                'message' => 'Curso não encontrado.'
            ], 202);
        }
        //verifica perfil
        if($request->fk_profile_id){
            $profile = Profile::find($request->fk_profile_id);
            if(!$profile){
                return response()->json([
                    'message' => 'Perfil não encontrado.'
                ], 202);
            }
            if($profile->fk_course_id != $course->id){
                return response()->json([
                    'message' => 'Operação não permitida. O perfil não pertence ao curso informado.'
                ], 202);
            }
        }
        //verifica competência
        if($request->fk_skill_id){
            $skill = Skill::find($request->fk_skill_id);
            if(!$skill){
                return response()->json([
                    'message' => 'Competência não encontrada.'
                ], 202);
            }
            if($skill->fk_course_id != $course->id){
                return response()->json([
                    'message' => 'Operação não permitida. A Competência não pertence ao curso informado.'
                ], 202);
            }
        }

        $this->verifyRecord($question);

        $question->base_text = $request->base_text;
        $question->stem = $request->stem;
        $question->reference = $request->reference;
        $question->fk_profile_id = $request->fk_profile_id;
        $question->fk_skill_id = $request->fk_skill_id;
        $question->fk_user_id = $user->id;
        $question->fk_course_id = $request->fk_course_id;
        $question->save();


        return response()->json([
            'message' => 'Questão '.$question->id.' atualizada.',
            $question
        ], 200);

    }

    public function destroy($id)
    {
        //falta colocar para excluir todos os itens se for permitido a exclusao da questao
        $question = Question::find($id);

        if($question->validated == 1){
            return response()->json([
                'message' => 'Operação não pode ser realizada. A questão já foi validada.'
            ], 202);
        }

        $user = auth('api')->user();

        if($question->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Operação não pode ser realizada. A questão pertence a outro usuário.'
            ], 202);
        }

        $this->verifyRecord($question);

        //falta colocar validacao se a questão já tiver sido aplicada em uma avaliacao

        $question->delete();

        return response()->json([
            'message' => 'Questão '.$question->id.' excluída!'
        ], 200);
    }

    public function validateQuestion($id){
        $user = auth('api')->user();
        $question = Question::find($id);

        if($question->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Acesso não permitido para esta questão.'
            ], 202);
        }

        $this->verifyRecord($question);

        $knowledge_objects = QuestionHasKnowledgeObject::where('fk_question_id', '=', $id)->get();

        if(sizeof($knowledge_objects)==0){
            return response()->json([
                'message' => 'Operação não pode ser executada. A questão não possui Objetos de Conhecimento cadastrados.'
            ], 202);
        }


        $count_items_stored_correct = QuestionItem::where('fk_question_id', '=', $question->id)
                                ->where('correct_item', '=', '1')->count();

        if($count_items_stored_correct != 1){
            return response()->json([
                'message' => 'Operação não pode ser executada. A questão deve possuir um único item correto.'
            ], 202);
        }

        if($question->validated == 0) {
            $question->validated = 1;
            $question->save();
        }

        return response()->json([
            'message' => 'Questão validada!'
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
