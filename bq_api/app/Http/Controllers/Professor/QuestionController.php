<?php

namespace App\Http\Controllers\Professor;

use App\Course;
use App\CourseProfessor;
use App\Http\Controllers\Util\DepthFirstSearch;
use App\KeywordQuestion;
use App\KnowledgeObject;
use App\Providers\KnowledgeObjectRelated;
use App\Question;
use App\QuestionHasKnowledgeObject;
use App\QuestionItem;
use App\RankQuestion;
use App\Regulation;
use App\Skill;
use App\TypeOfEvaluation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Validator;
use function MongoDB\BSON\toJSON;

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
        $year = $request->year;
        $fk_type_of_evaluation_id = $request->fk_type_of_evaluation_id;

        $questions = Question::when($opcao == "S", function ($query) {
                //pega todas as questões do usuário logado
                $user = auth('api')->user();
                return $query->where('fk_user_id', '=', $user->id)
                    ->where('validated', '=', 1);
            })
            ->when($id, function ($query, $id) {
                //pega questões validadas de todos os usuário
                return $query->where('id', '=', $id);
            })
            ->when($opcao == "T", function ($query) {
                //pega questões validadas de todos os usuário
                return $query->where('validated', '=', 1);
            })
            ->when($opcao == "N", function ($query) {
                //pega todas as questões do usuário logado
                $user = auth('api')->user();
                return $query->where('fk_user_id', '=', $user->id)
                    ->where('validated', '=', 0);
            })
            ->when($course > 0 && !$object, function ($query) use ($course){
                //pega questão de um curso específicp
                //dd($course);
                return $query->where('fk_course_id', '=', $course);

            })
            ->when($skill > 0, function ($query) use ($skill){
                //pega questão de um curso específicp
                //dd($course);
                return $query->where('fk_skill_id', '=', $skill);

            })
            ->when($year > 0, function ($query) use ($year){
                //pega questão de um curso específicp
                //dd($course);
                return $query->where('year', '=', $year);

            })
            ->when($fk_type_of_evaluation_id > 0, function ($query) use ($fk_type_of_evaluation_id){
                //pega questão de um curso específicp
                //dd($course);
                return $query->where('fk_type_of_evaluation_id', '=', $fk_type_of_evaluation_id);

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
            ->when(($opcao == "T") && ($course == 0 || $course == null), function ($query) {
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
                $obj_relate = KnowledgeObjectRelated::select('fk_obj1_id', 'fk_obj2_id')->get();

                // Encontre todos os itens relacionados a partir do valor inicial
                $dfs = new DepthFirstSearch();
                $itens_relacionados = $dfs->encontrarItensRelacionados($object, $obj_relate);

                $question_knowledge_objects = QuestionHasKnowledgeObject::whereIn('fk_knowledge_object', $itens_relacionados)
                    ->select('fk_question_id')->get();

                return $query->whereIn('id', $question_knowledge_objects);

            })
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
            ->with('regulation');

        if($object){
            $object_selected = KnowledgeObject::where('id', $object)->first();
             $questions->orderByRaw('CASE WHEN fk_course_id = '.$object_selected->fk_course_id.' THEN 0 ELSE 1 END');

        }

        $questions->orderBy('id', 'desc');

        return response()->json($questions->paginate(8), 200);
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

        //verifica competência
        if($request->fk_skill_id){
            $skill = Skill::find($request->fk_skill_id);
            if(!$skill){
                return response()->json([
                    'message' => 'Competência não encontrada.'
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

        $regulation = null;
        if($request->fk_regulation_id){
            $regulation = Regulation::find($request->fk_regulation_id);

            if(!$regulation){
                return response()->json([
                    'message' => 'Regulamentação não encontrado.'
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
        $question->fk_type_of_evaluation_id = $request->fk_type_of_evaluation_id;
        if($request->year){
            $question->year = $request->year;
        } else {
            $question->year = date("Y");
        }
        if($regulation) {
            $question->fk_regulation_id = $regulation->id;
            $question->fk_course_id = $regulation->fk_course_id;
        }
        if($request->initial_difficulty){
            $question->initial_difficulty = $request->initial_difficulty;
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
            ->with('regulation')
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

        /*if($question->validated == 1){
            //falta colocar validacao se a questão já tiver sido aplicada em uma avaliacao
            return response()->json([
                'message' => 'A questão não pode ser editada.'
            ], 202);
        }*/

        //verifica competência
        if($request->fk_skill_id){
            $skill = Skill::find($request->fk_skill_id);
            if(!$skill){
                return response()->json([
                    'message' => 'Competência não encontrada.'
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

        $regulation = null;
        if($request->fk_regulation_id){
            $regulation = Regulation::find($request->fk_regulation_id);

            if(!$regulation){
                return response()->json([
                    'message' => 'Regulamentação não encontrado.'
                ], 202);
            }
        }

        $this->verifyRecord($question);

        if($question->validated == 0) {
            $question->base_text = $request->base_text;
            $question->stem = $request->stem;
        }
        $question->reference = $request->reference;
        if($request->fk_skill_id) {
            $question->fk_skill_id = $request->fk_skill_id;
        }
        if($regulation) {
            $question->fk_regulation_id = $regulation->id;
            $question->fk_course_id = $regulation->fk_course_id;
        }
        $question->fk_user_id = $user->id;
        if($request->fk_type_of_evaluation_id){
            $question->fk_type_of_evaluation_id = $request->fk_type_of_evaluation_id;
        }
        if($request->initial_difficulty){
            $question->initial_difficulty = $request->initial_difficulty;
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

        if(!$request->fk_regulation_id){
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

        $regulation = Regulation::find($request->fk_regulation_id);
        if(!$regulation){
            return response()->json([
                'message' => 'Regulamentação não encontrada.'
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
        }

        $this->verifyRecord($question);
        $question->fk_skill_id = $request->fk_skill_id;
        $question->fk_regulation_id = $regulation->id;
        $question->fk_course_id = $regulation->fk_course_id;
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
        $new_question->base_text = '(QUESTÃO DUPLICADA - Apagar este texto) '.$question->base_text;
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
