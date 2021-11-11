<?php

namespace App\Http\Controllers\Professor;

use App\Course;
use App\CourseProfessor;
use App\KeywordQuestion;
use App\Question;
use App\QuestionHasKnowledgeObject;
use App\QuestionItem;
use App\RankQuestion;
use App\Skill;
use App\TypeOfEvaluation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
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

    ];

    private $messages = [
        'description.required' => 'A DESCRIÇÃO é obrigatória.',
        'stem.required' => 'O ENUNCIADO é obrigatório.',

    ];

    public function index(Request $request)
    {
        //retorna todas as questões do usuário ativo
        $user = auth('api')->user();

        $course = $request->fk_course_id;
        /*
         * Variável opção
            S - do usuário
            T - de todos os usuários
        */
        $id = $request->id;
        $opcao = $request->user;
        $course = $request->fk_course_id;
        $object = $request->fk_object_id;
        $skill = $request->fk_skill_id;
        $keyword = $request->keyword;
        //dd($course);
        $questions = Question::when($opcao == "S", function ($query, $opcao) {
                //pega todas as questões do usuário logado
                $user = auth('api')->user();
                return $query->where('fk_user_id', '=', $user->id);
            })
            ->when($id, function ($query, $id) {
                //pega questões validadas de todos os usuário
                return $query->where('id', '=', $id);
            })
            ->when($opcao == "T", function ($query) {
                //pega questões validadas de todos os usuário
                return $query->where('validated', '=', 1);
            })
            ->when($course > 0, function ($query) use ($course){
                //pega questão de um curso específicp
                //dd($course);
                return $query->where('fk_course_id', '=', $course);

            })
            ->when($skill > 0, function ($query) use ($skill){
                //pega questão de um curso específicp
                //dd($course);
                return $query->where('fk_skill_id', '=', $skill);

            })
            ->when($keyword, function ($query) use ($keyword){
                //pega questão de um curso específicp
                //dd($course);
                $listKeywords = KeywordQuestion::where('keyword', $keyword)->get();
                $arr = array();
                foreach ($listKeywords as $key){
                    //dd($enaq);
                    $arr[] = $key->fk_question_id;
                }
                return $query->whereIn('id', $arr);

            })
            ->when(($opcao != "S") && ($course == 0 || $course == null), function ($query) {
                //pega questões de todos os cursos que o usuário tem permissão
                $user = auth('api')->user();
                $courses_user = CourseProfessor::where('fk_user_id', $user->id)
                    ->where('valid', 1)->get();
                $arr = array();
                foreach ($courses_user as $courses_u){
                    //dd($enaq);
                    $arr[] = $courses_u->fk_course_id;
                }
                return $query->whereIn('fk_course_id', $arr)
                        ->where('validated', 1);
            })
            ->when($object > 0, function ($query) use ($object) {
                //pega questões de todos os cursos
                $user = auth('api')->user();
                $questions_objects = QuestionHasKnowledgeObject::where('fk_knowledge_object', $object)
                    ->get();
                $arr = array();
                foreach ($questions_objects as $object){
                    //dd($enaq);
                    $arr[] = $object->fk_question_id;
                }
                return $query->whereIn('id', $arr);
            })
            ->orderBy('id', 'desc')
            ->withCount('rank')
            //->with('difficulty')
            ->with('keywords')
            ->with('rankAvg')
            ->with('rankByUserActive')
            ->with('difficultyByUserActive')
            ->with('course')
            ->with('skill')
            ->with('knowledgeObjects')
            ->with('user')
            ->with('questionItems')
            ->with('typeOfEvaluation')
            ->paginate(8);

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

        if($request->fk_course_id){
            $course = Course::find($request->fk_course_id);
            if(!$course){
                return response()->json([
                    'message' => 'Curso não encontrado.'
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

        //verifica tipo de avaliação
        if($request->fk_type_of_evaluation_id){
            $typeOfEvaluation = TypeOfEvaluation::find($request->fk_type_of_evaluation_id);

            if(!$typeOfEvaluation){
                return response()->json([
                    'message' => 'Tipo de Avaliação não encontrado.'
                ], 202);
            }
        }

        $user = auth('api')->user();

        $question = new Question();
        $question->base_text = $request->base_text;
        $question->stem = $request->stem;
        $question->validated = 0;
        $question->reference = $request->reference;
        $question->fk_skill_id = $request->fk_skill_id;
        $question->fk_user_id = $user->id;
        $question->fk_course_id = $request->fk_course_id;
        $question->fk_type_of_evaluation_id = $request->fk_type_of_evaluation_id;
        if($request->year){
            $question->year = $request->year;
        } else {
            $question->year = date("Y");
        }
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
            ->with('skill')
            ->with('knowledgeObjects')
            ->with('user')
            ->with('questionItems')
            ->with('typeOfEvaluation')
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

        if($request->fk_course_id){
            $course = Course::find($request->fk_course_id);
            if(!$course){
                return response()->json([
                    'message' => 'Curso não encontrado.'
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
        //verifica tipo de avaliação
        if($request->fk_type_of_evaluation_id){
            $typeOfEvaluation = TypeOfEvaluation::find($request->fk_type_of_evaluation_id);
            if(!$typeOfEvaluation){
                return response()->json([
                    'message' => 'Tipo de Avaliação não encontrado.'
                ], 202);
            }
        }

        $this->verifyRecord($question);

        $question->base_text = $request->base_text;
        $question->stem = $request->stem;
        $question->reference = $request->reference;
        if($request->fk_skill_id) {
            $question->fk_skill_id = $request->fk_skill_id;
        }
        $question->fk_user_id = $user->id;
        if($request->fk_course_id){
            $question->fk_course_id = $request->fk_course_id;
        }
        if($request->fk_type_of_evaluation_id){
            $question->fk_type_of_evaluation_id = $request->fk_type_of_evaluation_id;
        }
        $question->year = $request->year;
        $question->save();


        return response()->json([
            'message' => 'Questão '.$question->id.' atualizada.',
            $question
        ], 200);

    }

    public function updateCourseSkill(Request $request, $id)
    {
        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if(!$request->fk_course_id){
            return response()->json([
                'message' => 'Informe o Curso.'
            ], 202);
        }

        $user = auth('api')->user();
        $question = Question::find($id);

        if($question->fk_user_id != $user->id){
            return response()->json([
                'message' => 'Acesso não permitido para esta questão.'
            ], 202);
        }

        $course = Course::find($request->fk_course_id);
        if(!$course){
            return response()->json([
                'message' => 'Curso não encontrado.'
            ], 202);
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
        $question->fk_skill_id = $request->fk_skill_id;
        $question->fk_course_id = $request->fk_course_id;
        $question->save();


        return response()->json([
            'message' => 'Questão '.$question->id.' atualizada.',
            $question
        ], 200);

    }

    public function destroy($id)
    {
        $question = Question::find($id);

        if($question->validated == 1){
            return response()->json([
                'message' => 'A questão já foi validada.'
            ], 202);
        }

        $user = auth('api')->user();

        $rank = RankQuestion::where('fk_question_id', $question->id)->get();

        if(sizeof($rank)>0){
            return response()->json([
                'message' => 'A questão possui classificação.'
            ], 202);
        }

        if($question->fk_user_id != $user->id){
            return response()->json([
                'message' => 'A questão pertence a outro usuário.'
            ], 202);
        }

        $this->verifyRecord($question);

        //falta colocar validacao se a questão já tiver sido aplicada em uma avaliacao

        //apaga as palavras-chave
        $keywords = KeywordQuestion::where('fk_question_id', $question->id)->get();
        foreach ($keywords as $keyword){
            $keyword->delete();
        }

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

        if($question->fk_course_id == null){
            return response()->json([
                'message' => 'A questão não possui uma área associada.'
            ], 202);
        }

        $knowledge_objects = QuestionHasKnowledgeObject::where('fk_question_id', '=', $id)->get();

        /*if(sizeof($knowledge_objects)==0){
            return response()->json([
                'message' => 'Operação não pode ser executada. A questão não possui Objetos de Conhecimento cadastrados.'
            ], 202);
        }*/

        $itens = QuestionItem::where('fk_question_id', '=', $question->id)
            ->get();

        if(sizeof($itens)<2){
            return response()->json([
                'message' => 'A questão deve possuir no mínimo duas alternativas.'
            ], 202);
        }

        $count_items_stored_correct = QuestionItem::where('fk_question_id', '=', $question->id)
                                ->where('correct_item', '=', '1')->count();

        if($count_items_stored_correct != 1){
            return response()->json([
                'message' => 'A questão deve possuir um único item correto.'
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

    public function duplicate($id){
        $user = auth('api')->user();
        $question = Question::find($id);

        $this->verifyRecord($question);

        $questions_itens = QuestionItem::where('fk_question_id',
            $question->id)->get();

        $objects = QuestionHasKnowledgeObject::where('fk_question_id', $question->id)->get();
        $keywords = KeywordQuestion::where('fk_question_id', $question->id)->get();

        $new_question = new Question();
        $new_question->base_text = '(QUESTÃO DUPLICADA - Aapagar este texto) '.$question->base_text;
        $new_question->stem = $question->stem;
        $new_question->validated = 0;
        $new_question->reference = $question->reference;
        $new_question->fk_skill_id = $question->fk_skill_id;
        $new_question->fk_user_id = $user->id;
        $new_question->fk_course_id = $question->fk_course_id;
        //pega usuário que criou a questão
        $new_question->fk_course_id = $question->fk_course_id;
        $new_question->save();

        //duplica alternativas da questão
        foreach($questions_itens as $item){
            $new_question_item = new QuestionItem();
            $new_question_item->description = $item->description;
            $new_question_item->correct_item = $item->correct_item;
            $new_question_item->fk_question_id = $new_question->id;
            $new_question_item->save();
        }

        //duplica objetos de conhecimento da avaliação
        foreach($objects as $object){
            $new_object = new QuestionHasKnowledgeObject();
            $new_object->fk_question_id = $new_question->id;
            $new_object->fk_knowledge_object = $object->fk_knowledge_object;
            $new_object->save();
        }

        //duplica as palavras-chave
        foreach($keywords as $keyword){
            $new_key = new KeywordQuestion();
            $new_key->keyword = $keyword->keyword;
            $new_key->fk_question_id = $new_question->id;
            $new_key->save();
        }

        return response()->json([
            'message' => 'Questão cadastrada (duplicada).',
            $new_question
        ], 200);

    }

    public function verifyRecord($record){
        if(!$record || $record == '[]'){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 202);
        }
    }

    public function upload_image(Request $request){
        //$user = auth('api')->user();
        $storagePath = null;
        if(!$request->hasFile('image')){
            return response()->json([
                'message' => 'A imagem não foi informada.',
            ], 202);
        }
        if(filesize($request->file('image')) > 150000){
            return response()->json([
                'message' => 'A imagem deve ter no máximo 150 kb.'
            ], 202);

        }
        //$name = time();
        //$image = $request->file('image')->storeAs('imagens', $name.'.jpg');
        //$storagePath = $request->file('image')->storeAs('images', $user->id.'_'.$name.'.jpg', 's3', 'public');
        $storagePath = Storage::disk('s3')->put("images", $request->file('image'), 'public');

        return response()->json([
            'url_image' => 'https://questione.s3-us-west-2.amazonaws.com/'.$storagePath,
        ], 200);
    }
}
