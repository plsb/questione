<?php

namespace App\Http\Controllers;

use App\Course;
use App\CourseProfessor;
use App\Http\Controllers\Util\DepthFirstSearch;
use App\KeywordQuestion;
use App\KnowledgeArea;
use App\KnowledgeObject;
use App\Providers\KnowledgeObjectRelated;
use App\Question;
use App\Regulation;
use App\Skill;
use App\TypeOfEvaluation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Validator;

class AllUsers extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth']);
    }

    public function typeOfevaluation()
    {
        $typeOfEvaluations = TypeOfEvaluation::orderBy('description')->get();

        return response()->json($typeOfEvaluations, 200);
    }

    public function courses()
    {
        $courses = Course::orderBy('description')->get();

        return response()->json($courses, 200);
    }

    public function areas()
    {
        $areas = KnowledgeArea::orderBy('description')->get();

        return response()->json($areas, 200);
    }

    public function coursesWithQuestionsByTypoOfEvaluation($id_type_of_evaluation)
    {
        if(!$id_type_of_evaluation){
            return response()->json([
                'message' => 'Informe o tipo de avaliação.'
            ], 202);
        }

        $arr_id_courses = [];
        $questions = Question::where('fk_type_of_evaluation_id', $id_type_of_evaluation)
            ->whereNotNull('fk_skill_id')
            ->groupBy('fk_course_id')
            ->get('fk_course_id');
        foreach ($questions as $q){
            $arr_id_courses[] = $q->fk_course_id;
        }
        $courses = Course::whereIn('id', $arr_id_courses)->orderBy('description')->get();

        return response()->json($courses, 200);
    }

    public function skillsWithQuestionsByTypoOfEvaluation(Request $request)
    {
        if(!$request->fk_course_id){
            return response()->json([
                'message' => 'Informe o curso.'
            ], 202);
        }

        $arr_id_skills = [];
        $questions = Question::whereNotNull('fk_type_of_evaluation_id')
            ->where('fk_course_id', '=', $request->fk_course_id)
            ->groupBy('fk_skill_id')
            ->get('fk_skill_id');
        foreach ($questions as $q){
            $arr_id_skills[] = $q->fk_skill_id;
        }
        $skills = Skill::whereIn('id', $arr_id_skills)->orderBy('description')->get();

        return response()->json($skills, 200);
    }

    public function allSkillsByRegulation(Request $request)
    {
        $regulation_id = $request->fk_regulation_id;
        if(!$regulation_id){
            return response()->json([
                'message' => 'Informe o curso.'
            ], 202);
        }
        $skill = Skill::where('fk_regulation_id', $regulation_id)
            ->orderBy('description')
            ->get();

        return response()->json($skill, 200);
    }

    public function keywords(Request $request)
    {
        $user = auth('api')->user();

        $courses_professor = CourseProfessor::where('fk_user_id', $user->id)
            ->where('valid', 1)
            ->select('fk_course_id')
            ->get();
        $questions = Question::whereIn('fk_course_id', $courses_professor)
            ->select('id')
            ->get();

        $keywords = KeywordQuestion::whereIn('fk_question_id', $questions->makeHidden('difficulty')->toArray())
            ->select('keyword')
            ->distinct()
            ->orderBy('keyword')
            ->get();

        return response()->json($keywords, 200);
    }

    public function allObjectsByRegulation(Request $request)
    {
        $regulation_id = $request->fk_regulation_id;
        if(!$regulation_id){
            return response()->json([
                'message' => 'Informe o curso.'
            ], 202);
        }

        $objects = KnowledgeObject::where('fk_regulation_id', $regulation_id)
            ->orderBy('description')
            ->get();

        return response()->json($objects, 200);

    }

    public function knowledgeObjects(Request $request)
    {
        $course_id = $request->fk_course_id;
        if(!$course_id){
            return response()->json([
                'message' => 'Informe o curso.'
            ], 202);
        }

        //seleciona todos os objetos pertecentes a questões do curso pesquisado
        $objects_questions = DB::table('questions')
            ->select('knowledge_objects.id',
                'knowledge_objects.description',
                'knowledge_objects.fk_course_id'
            )
            ->join('question_knowledge_objects', 'question_knowledge_objects.fk_question_id', '=', 'questions.id')
            ->join('knowledge_objects', 'question_knowledge_objects.fk_knowledge_object', '=', 'knowledge_objects.id')
            ->where('questions.fk_course_id', $course_id)
            ->orderBy('knowledge_objects.description')
            ->groupBy('knowledge_objects.id')
            ->get();


        $array = array();
        foreach ($objects_questions as $item){ //percorre cada objeto
            //$obj = $this->verifyObjectsRelated($item); //verifica se o objeto tem relação com outro objeto
            $obj_relate = KnowledgeObjectRelated::select('fk_obj1_id', 'fk_obj2_id')->get();

            // Encontre todos os itens relacionados a partir do valor inicial
            $dfs = new DepthFirstSearch();
            $itens_relacionados = $dfs->encontrarItensRelacionados($item->id, $obj_relate);

            $obj_max = DB::table('knowledge_objects')
                ->select('knowledge_objects.id',
                    'knowledge_objects.description',
                    'knowledge_objects.fk_course_id',
                    'knowledge_objects.fk_regulation_id'
                )
                ->join('regulation', 'regulation.id', '=', 'knowledge_objects.fk_regulation_id')
                ->whereIn('knowledge_objects.id', $itens_relacionados)
                ->where('knowledge_objects.fk_course_id', $item->fk_course_id)
                ->orderBy('regulation.year', 'desc')
                ->first();


            if($obj_max != null){ // se o objeto tiver relação apresenta o objeto mais atual na lista
                    $array[] = $obj_max->id;
            } else {
                $array[] = $item->id;;
            }
        }

        $return = KnowledgeObject::whereIn('id', $array)
            ->orderBy('description')
            ->get();


        /*$objects = KnowledgeObject::where('fk_course_id', $course_id)
            ->where('fk_regulation_id', $regulation->id)
            ->orderBy('description')
            ->get();*/

        return response()->json($return, 200);
    }
    private $rulesUser = [
        'name' => 'required|max:50|min:8'
    ];

    private $messagesUser = [
        'name.required' => 'O NOME DO USUÁRIO é obrigatório.',
        'name.max' => 'O máximo de caracteres aceitáveis para o NOME DO USUÁRIO é 50.',
        'name.min' => 'O minímo de caracteres aceitáveis para o NOME DO USUÁRIO é 8.',
    ];

    public function updateProfileUser(Request $request)
    {
        $validation = Validator::make($request->all(),$this->rulesUser, $this->messagesUser);

        if($validation->fails()){
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        $user = auth('api')->user();
        $user->name = strtoupper($request->name);
        $user->save();

        return response()->json([
            'message' => 'Usuário atualizado.',
            $user
        ], 200);
    }

    public function coursesUser(Request $request){
        $user = auth('api')->user();

        $courses_user = CourseProfessor::where('fk_user_id', $user->id)
            ->where('valid', 1)->get();
        $arr = array();
        foreach ($courses_user as $courses_u){
            $arr[] = $courses_u->fk_course_id;
        }

        $courses = Course::whereIn('id', $arr)
            ->with('regulations')
            ->get();

        return response()->json($courses, 202);
    }

    public function showTourFalse(){
        $user = auth('api')->user();
        $user->show_tour = false;
        $user->save();
        return response()->json($user, 200);
    }
}
