<?php

namespace App\Http\Controllers\Adaptive;

use App\ClassBadgesSettings;
use App\ClassGamificationScoreSettings;
use App\ClassGamificationSettings;
use App\ClassQuestione;
use App\ClassStudents;
use App\Course;
use App\CourseProfessor;
use App\Http\Controllers\Gamification\PointSystemController;
use App\Http\Controllers\Util\DepthFirstSearch;
use App\KnowledgeObject;
use App\Providers\KnowledgeObjectRelated;
use App\Question;
use App\QuestionHasKnowledgeObject;
use App\Regulation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;
use DB;
use function App\Http\Controllers\Professor\mb_strtoupper;

class GenerateEvaluationController extends Controller
{

    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkProfessor']);
    }

    public function generate(Request $request)
    {
        $total_number_of_questions_to_have_on_a_test = 10; //representa o total de questões que devem ter na prova

        if(!$request->fk_course_id){
            return response()->json(['message' => 'Informe o curso.'], 202);
        }

        $course = Course::find($request->fk_course_id);
        if(!$course){
            return response()->json(['message' => 'Curso não encontrado.'], 202);
        }

        $regulation = Regulation::where('fk_course_id', $course->id)->select('id')->get();
        if(!$regulation){
            return response()->json(['message' => 'O curso não possui portarias cadastradas.'], 202);
        }

        $totalRegulation = sizeof($regulation);

        $array_difficulty = array(1, 2, 3, 4, 5); //armazena os níveis de dificuldade na prova
        $array_total_questions_by_difficulty = $this->calculatesTotalQuestionsByDifficulty($total_number_of_questions_to_have_on_a_test, $array_difficulty, $regulation, $totalRegulation);

        $array_total_questions_by_object = $this->calculatesTotalQuestionsByObject($total_number_of_questions_to_have_on_a_test, $course, $regulation, $totalRegulation);

        $array_objects_that_must_be_in_the_test = array();
        foreach ($array_total_questions_by_object as $item){
            if($item->number_questions_in_the_evaluation > 0){
                $array_objects_that_must_be_in_the_test[] = $item;
            }
        }

        /*
         * Geração da prova
         */

        for ($i = 1; $i <= 5; $i++) {
            /*
             * Cria uma variável dinâmica com o nome "qtd_questoes_dificuldade_" concatenado com o valor de $i
             * Atribui o valor correspondente do array ao nome da variável dinâmica
             */
            ${"qtd_questions_difficulty_" . $i} = $array_total_questions_by_difficulty[$i - 1];
        }

        $array_final_id_questions_that_must_have_a_test = array();
        foreach ($array_objects_that_must_be_in_the_test as $item){
            $total_questions_from_object = $item->number_questions_in_the_evaluation;
            /*
             * A dificuldade 1, 2 e 5 tem mais prioridade pois sempre possuem menos questões que estão nessa dificuldade
             */

            $array_final_id_questions_that_must_have_a_test = array_merge($array_final_id_questions_that_must_have_a_test,
                                                                            $this->selectQuestionsToComposeTest($item, 'questions_difficulty_1',
                                                                                $total_questions_from_object, $qtd_questions_difficulty_1));

            $array_final_id_questions_that_must_have_a_test = array_merge($array_final_id_questions_that_must_have_a_test,
                                                                            $this->selectQuestionsToComposeTest($item, 'questions_difficulty_5',
                                                                                $total_questions_from_object, $qtd_questions_difficulty_5));

            $array_final_id_questions_that_must_have_a_test = array_merge($array_final_id_questions_that_must_have_a_test,
                                                                            $this->selectQuestionsToComposeTest($item, 'questions_difficulty_2',
                                                                                $total_questions_from_object, $qtd_questions_difficulty_2));

            $array_final_id_questions_that_must_have_a_test = array_merge($array_final_id_questions_that_must_have_a_test,
                                                                            $this->selectQuestionsToComposeTest($item, 'questions_difficulty_3',
                                                                                $total_questions_from_object, $qtd_questions_difficulty_3));

            $array_final_id_questions_that_must_have_a_test = array_merge($array_final_id_questions_that_must_have_a_test,
                                                                            $this->selectQuestionsToComposeTest($item, 'questions_difficulty_4',
                                                                                $total_questions_from_object, $qtd_questions_difficulty_4));

        }


        $final_questions = Question::whereIn('id', $array_final_id_questions_that_must_have_a_test)
            ->with('knowledgeObjects')
            ->select(['id', 'initial_difficulty', 'fk_course_id'])
            ->get();

        return response()->json([$array_total_questions_by_difficulty, count($array_final_id_questions_that_must_have_a_test), $final_questions], 200);

    }

    function selectQuestionsToComposeTest($item, $property, &$total_questions_from_object, &$qtd_questions_difficulty) {
        $array_final_questions = array();
        if (property_exists($item, $property) && $total_questions_from_object > 0 && $qtd_questions_difficulty > 0) {
            $total_sub = 0;
            $countDifficulty = count($item->$property);

            if ($countDifficulty < $total_questions_from_object) {
                $array_final_questions = array_merge($array_final_questions, $item->$property);
                $total_sub = $countDifficulty;
            } else {
                $randomIndices = is_array($tmp = array_rand($item->$property, $total_questions_from_object))
                    ? $tmp
                    : [$tmp];

                foreach ($randomIndices as $value) {
                    $array_final_questions[] = $item->$property[$value];
                }

                $total_sub = $total_questions_from_object;
            }

            $qtd_questions_difficulty -= $total_sub;
            $total_questions_from_object -= $total_sub;
        }
        return $array_final_questions;
    }

    function calculatesTotalQuestionsByObject($total_number_of_questions_to_have_on_a_test, $course, $regulation, $totalRegulation){

        $questions = DB::table('questions')
            ->select('question_knowledge_objects.fk_knowledge_object',
                'knowledge_objects.description',
                DB::raw('COUNT(*) as total'))
            ->join('question_knowledge_objects', 'question_knowledge_objects.fk_question_id', '=', 'questions.id')
            ->join('knowledge_objects', 'knowledge_objects.id', '=', 'question_knowledge_objects.fk_knowledge_object')
            ->where('questions.validated', 1)
            ->where('questions.fk_type_of_evaluation_id', 2)
            ->whereIn('questions.fk_regulation_id', $regulation)
            ->groupBy('question_knowledge_objects.fk_knowledge_object')
            ->groupBy('knowledge_objects.description')
            ->orderBy('question_knowledge_objects.fk_knowledge_object')
            ->get();


        $knowledge_objects = KnowledgeObject::where('fk_course_id', $course->id)->select('id')->get();
        $list_object_relacted = KnowledgeObjectRelated::whereIn('fk_obj1_id', $knowledge_objects)
            ->orWhereIn('fk_obj2_id', $knowledge_objects)
            ->select('fk_obj1_id', 'fk_obj2_id')
            ->with('object1')
            ->with('object2')
            ->get();

        $objects_array = array();
        if ($questions) {
            foreach ($questions as $item) {
                $object = $item->fk_knowledge_object;

                $dfs = new DepthFirstSearch();
                $itens_relacionados = $dfs->encontrarItensRelacionados($object, $list_object_relacted);

                /*
                 * Pega o id e a decrição do conteúdo (objeto)
                 * mais atual seguindo as relações entre as portarias
                 * determinadas pelo administrador
                 */
                $id_object_actual = 0;
                $year_object_actual = 0;
                foreach ($itens_relacionados as $item_rel) {
                    $verify_object = KnowledgeObject::where('id', $item_rel)
                        ->with('regulation')
                        ->first();
                    if ($year_object_actual < $verify_object->regulation->year) {
                        $year_object_actual = $verify_object->regulation->year;
                        $id_object_actual = $item_rel;
                    }
                }

                $position = $this->searchByIdArray($objects_array, $id_object_actual);
                $description_object = $this->searchDescriptionObject($id_object_actual);

                /*
                 * Se a posição for menor que 0 significa que o conteúdo ainda não
                 * foi inserido no array que armazena o nome do conteúdo e o total de
                 * questões que tem no banco de dados sobre o assunto
                */
                if ($position < 0) {
                    $avg_total_questions = round($item->total / $totalRegulation, 2);
                    $total_questions = $item->total;
                } else {
                    $total_previous = $objects_array[$position]->total_questions_bank;
                    $avg_total_questions = round(($total_previous + $item->total) / $totalRegulation, 2);
                    $total_questions = $total_previous + $item->total;
                }

                $object = (object)[
                    'id' => $id_object_actual,
                    'description' => $description_object,
                    'total_questions_bank' => $total_questions,
                    'avg_total_questions' => $avg_total_questions,
                    'number_questions_in_the_evaluation' => 0,
                    'object_probability_in_assessment' => 0,
                    'objects_related' => $itens_relacionados,
                ];

                $position < 0 ? array_push($objects_array, $object) : $objects_array[$position] = $object;

            }

            $sum_avg_of_questions_per_object = 0; //armazena a soma das médias de todas as questões no conteúdo
            $array_perc_of_questions_per_object = array(); //armazena a porcentagens de cada conteúdo

            foreach ($objects_array as $item) {
                $sum_avg_of_questions_per_object = $sum_avg_of_questions_per_object + $item->avg_total_questions;// faz a soma do total das médias
            }
            foreach ($objects_array as $item) {
                $array_perc_of_questions_per_object[] = $item->avg_total_questions / $sum_avg_of_questions_per_object;//armazena a porcentagem de cada avg de cada conteúdo
            }

            $array_total_questions_by_object = $this->multinomialSample($total_number_of_questions_to_have_on_a_test, $array_perc_of_questions_per_object); //armaena o total de questões necessárias pra cada conteúdo

            $array_objects_raffle = array();
            $total_objects_raffle = 0;
            for ($i = 0; $i < sizeof($array_total_questions_by_object); $i++) {
                if($array_total_questions_by_object[$i] == 0){ //se o conteúdo tiver 0 questões selecionadas, adiciona para o array de sorteio
                    $array_objects_raffle[] = $objects_array[$i]->id;
                }
                if($array_total_questions_by_object[$i] > $objects_array[$i]->total_questions_bank){//se o total de questões selecionadas for maior que o total de questões no banco adiciona mais um na variável que vai estipular quantos conteúdos serão sorteados
                    $total_objects_raffle = $total_objects_raffle + ($array_total_questions_by_object[$i] - $objects_array[$i]->total_questions_bank);
                    $objects_array[$i]->number_questions_in_the_evaluation = $objects_array[$i]->total_questions_bank;
                } else {
                    $objects_array[$i]->number_questions_in_the_evaluation = $array_total_questions_by_object[$i];
                }

                $objects_array[$i]->number_questions_in_the_evaluation = $array_total_questions_by_object[$i];
                $objects_array[$i]->object_probability_in_assessment = $array_perc_of_questions_per_object[$i];

                //retorna os ids das questões por dificuldade
                $questions_has_objects = QuestionHasKnowledgeObject::whereIn('fk_knowledge_object',  $objects_array[$i]->objects_related)->get();
                $array_id_questions = array();
                foreach ($questions_has_objects as $item){
                    $array_id_questions[] = $item->fk_question_id;
                }

                $d = $this->returnArrayIdQuestions($array_id_questions, $regulation, 1);
                if($d != null) $objects_array[$i]->questions_difficulty_1 = $d;

                $d = $this->returnArrayIdQuestions($array_id_questions, $regulation, 2);
                if($d != null) $objects_array[$i]->questions_difficulty_2 = $d;

                $d = $this->returnArrayIdQuestions($array_id_questions, $regulation, 3);
                if($d != null) $objects_array[$i]->questions_difficulty_3 = $d;

                $d = $this->returnArrayIdQuestions($array_id_questions, $regulation, 4);
                if($d != null) $objects_array[$i]->questions_difficulty_4 = $d;

                $d = $this->returnArrayIdQuestions($array_id_questions, $regulation, 5);
                if($d != null) $objects_array[$i]->questions_difficulty_5 = $d;
            }

            if($total_objects_raffle > 0 && count($array_objects_raffle)>=$total_objects_raffle){//verifica se tem que sortear conteúdos para fazer parte da prova
                $indicesSorteados = array(array_rand($array_objects_raffle, $total_objects_raffle));

                for ($i=0; $i< count($indicesSorteados); $i++){
                    $position = $this->searchByIdArray($objects_array, $array_objects_raffle[$indicesSorteados[$i]]);
                    $objects_array[$position]->number_questions_in_the_evaluation = 1;
                }
            }

        }

        return $objects_array;
    }

    function calculatesTotalQuestionsByDifficulty($totalQuestions, $arrayDifficulty, $regulation, $totalRegulation) {
        $arrayPercDifficulty = [];
        $sumAvgGeneralDifficulty = 0;

        foreach ($arrayDifficulty as $value) {
            $totalDifficulty = Question::whereIn('fk_regulation_id', $regulation)
                ->where('fk_type_of_evaluation_id', 2)
                ->where('initial_difficulty', $value)
                ->count();

            $avgQuestionsByDifficulty = $totalDifficulty / $totalRegulation;
            $arrayPercDifficulty[] = $avgQuestionsByDifficulty;

            $sumAvgGeneralDifficulty += $avgQuestionsByDifficulty;
        }

        $arrayPercDifficulty = array_map(function ($perc) use ($sumAvgGeneralDifficulty) {
            return round($perc / $sumAvgGeneralDifficulty, 2);
        }, $arrayPercDifficulty);

        return $this->multinomialSample($totalQuestions, $arrayPercDifficulty);
    }

    function multinomialSample($numSamples, $probabilities) {
        $numCategories = count($probabilities);

        // Verifica se o número de probabilidades é válido
        if ($numCategories < 2) {
            throw new InvalidArgumentException("A distribuição multinomial requer pelo menos duas categorias.");
        }

        // Verifica se as probabilidades somam 1
        if (abs(array_sum($probabilities) - 1) > 0.0001) {
            throw new InvalidArgumentException("As probabilidades devem somar 1.");
        }

        $samples = array_fill(0, $numCategories, 0);

        for ($i = 0; $i < $numSamples; $i++) {
            $rand = mt_rand() / mt_getrandmax(); // Gera um número aleatório entre 0 e 1
            $cumulativeProb = 0;

            for ($j = 0; $j < $numCategories - 1; $j++) {
                $cumulativeProb += $probabilities[$j];

                if ($rand < $cumulativeProb) {
                    $samples[$j]++;
                    break;
                }
            }

            // Se o número aleatório estiver além das probabilidades anteriores, atribuímos ao último
            if ($rand >= $cumulativeProb) {
                $samples[$numCategories - 1]++;
            }
        }

        return $samples;
    }

    function returnArrayIdQuestions($arrayIdQuestions, $regulation, $difficulty) {
        /*
         * o método pluck para obtém diretamente um array com os valores da propriedade id.
         */
        return Question::whereIn('id', $arrayIdQuestions)
            ->whereIn('fk_regulation_id', $regulation)
            ->where('fk_type_of_evaluation_id', 2)
            ->where('initial_difficulty', $difficulty)
            ->pluck('id')
            ->toArray();
    }

    private function searchByIdArray($array, $id) {
        foreach ($array as $posicao => $objeto) {
            if ($objeto->id === $id) {
                return $posicao;
            }
        }
        // Retorna falso se o ID não for encontrado
        return -1;
    }

    private function searchDescriptionObject($object) {
        return KnowledgeObject::find($object)->description ?? '';
    }

}
