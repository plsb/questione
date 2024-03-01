<?php

namespace App\Adaptive;

use App\Course;
use App\CourseProfessor;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Util\DepthFirstSearch;
use App\Http\Controllers\Util\MultinomialDistributionSampler;
use App\KeywordQuestion;
use App\KnowledgeArea;
use App\KnowledgeObject;
use App\Providers\KnowledgeObjectRelated;
use App\Question;
use App\QuestionHasKnowledgeObject;
use App\Regulation;
use App\Skill;
use App\TypeOfEvaluation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Validator;

class KnowledgeObjectAssessmentManager extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkProfessor']);
    }

    function getQuestionsByKnowledgeObjects($regulation) {
        return DB::table('questions')
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
    }

    function getKnowledgeObjects($course) {
        return KnowledgeObject::where('fk_course_id', $course->id)->select('id')->get();
    }

    function getListObjectRelated($knowledge_objects) {
        return KnowledgeObjectRelated::whereIn('fk_obj1_id', $knowledge_objects)
            ->orWhereIn('fk_obj2_id', $knowledge_objects)
            ->select('fk_obj1_id', 'fk_obj2_id')
            ->with('object1')
            ->with('object2')
            ->get();
    }

    /*function findMostRecentObject($itens_relacionados) {
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

        return $id_object_actual;
    }*/

    function calculatesTotalQuestionsByObject($total_number_of_questions_to_have_on_a_test, $course, $regulation, $totalRegulation){
        // Obter as questões relacionadas aos objetos de conhecimento
        $questions = $this->getQuestionsByKnowledgeObjects($regulation);

        // Obter os objetos de conhecimento relacionados ao curso
        $knowledge_objects = $this->getKnowledgeObjects($course);

        // Obter a lista de objetos relacionados
        $list_object_relacted = $this->getListObjectRelated($knowledge_objects);

        // Array para armazenar os resultados finais
        $objects_array = array();

        if ($questions) {
            foreach ($questions as $item) {
                // Obter o objeto de conhecimento relacionado à questão
                $object = $item->fk_knowledge_object;

                // Realizar uma busca em profundidade para encontrar objetos relacionados
                $dfs = new DepthFirstSearch();
                $itens_relacionados = $dfs->encontrarItensRelacionados($object, $list_object_relacted);

                // Encontrar o objeto mais recente
                $id_object_actual = $dfs->findMostRecentObject($itens_relacionados);;

                // Procurar a posição do objeto no array
                $position = $this->searchByIdArray($objects_array, $id_object_actual);

                $description_object = $this->searchDescriptionObject($id_object_actual);

                // Calcular médias e total de questões
                if ($position < 0) {
                    $avg_total_questions = round($item->total / $totalRegulation, 2);
                    $total_questions = $item->total;
                } else {
                    $total_previous = $objects_array[$position]->total_questions_bank;
                    $avg_total_questions = round(($total_previous + $item->total) / $totalRegulation, 2);
                    $total_questions = $total_previous + $item->total;
                }

                // Criar objeto com os resultados
                $object = (object)[
                    'id' => $id_object_actual,
                    'description' => $description_object,
                    'total_questions_bank' => $total_questions,
                    'avg_total_questions' => $avg_total_questions,
                    'number_questions_in_the_evaluation' => 0,
                    'object_probability_in_assessment' => 0,
                    'objects_related' => $itens_relacionados,
                ];

                // Adicionar o objeto ao array ou atualizar se já existir
                $position < 0 ? array_push($objects_array, $object) : $objects_array[$position] = $object;

            }

            // Calcular a soma das médias de todas as questões no conteúdo
            $sum_avg_of_questions_per_object = array_sum(array_column($objects_array, 'avg_total_questions'));

            // Calcular a porcentagem de cada média de cada conteúdo
            $array_perc_of_questions_per_object = array();
            foreach ($objects_array as $item) {
                $array_perc_of_questions_per_object[] = $item->avg_total_questions / $sum_avg_of_questions_per_object;//armazena a porcentagem de cada avg de cada conteúdo
            }

            // Calcular o total de questões necessárias para cada conteúdo
            $multinomialSampler = new MultinomialDistributionSampler();
            $array_total_questions_by_object = $multinomialSampler->multinomialSample($total_number_of_questions_to_have_on_a_test, $array_perc_of_questions_per_object); //armaena o total de questões necessárias pra cada conteúdo

            // Array para armazenar objetos a serem sorteados
            $array_objects_raffle = array();

            // Variável para armazenar o total de objetos a serem sorteados
            $total_objects_raffle = 0;
            for ($i = 0; $i < sizeof($array_total_questions_by_object); $i++) {
                // Adicionar ao array de sorteio se o conteúdo tiver 0 questões selecionadas
                if($array_total_questions_by_object[$i] == 0){
                    $array_objects_raffle[] = $objects_array[$i]->id;
                }

                // Se o total de questões selecionadas for maior que o total de questões no banco, atualizar variáveis
                if($array_total_questions_by_object[$i] > $objects_array[$i]->total_questions_bank){
                    $total_objects_raffle = $total_objects_raffle + ($array_total_questions_by_object[$i] - $objects_array[$i]->total_questions_bank);
                    $objects_array[$i]->number_questions_in_the_evaluation = $objects_array[$i]->total_questions_bank;
                } else {
                    $objects_array[$i]->number_questions_in_the_evaluation = $array_total_questions_by_object[$i];
                }

                // Definir o número de questões da avaliação
                $objects_array[$i]->number_questions_in_the_evaluation = $array_total_questions_by_object[$i];
                $objects_array[$i]->object_probability_in_assessment = $array_perc_of_questions_per_object[$i];

                // Retornar os IDs das questões por dificuldade
                $questions_has_objects = QuestionHasKnowledgeObject::whereIn('fk_knowledge_object',  $objects_array[$i]->objects_related)->get();
                $array_id_questions = array();

                foreach ($questions_has_objects as $item){
                    $array_id_questions[] = $item->fk_question_id;
                }

                // Definir as questões por dificuldade
                for ($difficulty = 1; $difficulty <= 5; $difficulty++) {
                    $d = $this->returnArrayIdQuestions($array_id_questions, $regulation, $difficulty);
                    if ($d != null) $objects_array[$i]->{"questions_difficulty_$difficulty"} = $d;
                }
            }

            // Verificar se é necessário sortear conteúdos para fazer parte da prova
            if($total_objects_raffle > 0 && count($array_objects_raffle)>=$total_objects_raffle){//verifica se tem que sortear conteúdos para fazer parte da prova
                // Sortear índices
                $indicesSorteados = array(array_rand($array_objects_raffle, $total_objects_raffle));

                // Iterar sobre os índices sorteados e atualizar o número de questões na avaliação
                for ($i=0; $i< count($indicesSorteados); $i++){
                    $position = $this->searchByIdArray($objects_array, $array_objects_raffle[$indicesSorteados[$i]]);
                    $objects_array[$position]->number_questions_in_the_evaluation = 1;
                }
            }

        }

        return $objects_array;
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

    private function returnArrayIdQuestions($arrayIdQuestions, $regulation, $difficulty) {
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


}
