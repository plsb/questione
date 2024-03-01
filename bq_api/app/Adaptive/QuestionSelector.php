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

class QuestionSelector extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkProfessor']);
    }

    /**
     * Seleciona perguntas para compor um teste com base em critérios especificados.
     *
     * @param object $item                        O objeto contendo informações sobre a área de conhecimento.
     * @param string $property                    A propriedade representando o nível de dificuldade.
     * @param int    $totalQuestionsFromObject    O número total de perguntas associadas à área de conhecimento.
     * @param int    $quantityDifficulty         A quantidade desejada de perguntas para o nível de dificuldade especificado.
     *
     * @return array O array contendo os IDs das perguntas selecionadas.
     */
    public function selectTestQuestionsByDifficultyAndContent($array_final_id_questions_that_must_have_a_test, $item, $property, &$totalQuestionsFromObject, &$quantityDifficulty)
    {
        $selectedQuestions = $array_final_id_questions_that_must_have_a_test;

        // Verifica se a propriedade existe e se há perguntas restantes para selecionar
        if (property_exists($item, $property) && $totalQuestionsFromObject > 0 && $quantityDifficulty > 0) {
            $totalSub = 0;
            $countDifficulty = count($item->$property);

            // Se houver menos questões disponíveis do que o necessário, selecione todas disponíveis
            if ($countDifficulty < $totalQuestionsFromObject) {
                // Verifica se há interseção entre os arrays
                $intersection = array_intersect($selectedQuestions, $item->$property);
                // Adiciona os elementos que não estão na interseção
                $valuesAdd = array_diff($item->$property, $intersection);

                $selectedQuestions = array_merge($selectedQuestions, $valuesAdd);
                $totalSub = $countDifficulty;
            } else {
                // Seleciona índices aleatórios se houver questões suficientes disponíveis
                $randomIndices = is_array($tmp = array_rand($item->$property, $totalQuestionsFromObject))
                    ? $tmp
                    : [$tmp];

                // Adiciona as perguntas selecionadas ao array
                foreach ($randomIndices as $value) {
                    //se o valor não existir no array, é adicionado
                    if (!in_array($item->$property[$value], $selectedQuestions)) {
                        $selectedQuestions[] = $item->$property[$value];
                    }
                }

                $totalSub = $totalQuestionsFromObject;
            }

            // Atualiza as quantidades restantes
            $quantityDifficulty -= $totalSub;
            $totalQuestionsFromObject -= $totalSub;
        }

        return $selectedQuestions;
    }

    //// Verifica se não foram geradas o total de questões adequadas
    function selectRandomTestItems($total_number_of_questions_to_have_on_a_test, $array_final_id_questions_that_must_have_a_test, $regulation) {
        // Verifica se não foram geradas o total de questões adequadas
        if ($total_number_of_questions_to_have_on_a_test > count($array_final_id_questions_that_must_have_a_test)) {
            $numPositionsToDraw = $total_number_of_questions_to_have_on_a_test - count($array_final_id_questions_that_must_have_a_test);

            $questionsToChoose = Question::whereIn('fk_regulation_id', $regulation)
                ->where('fk_type_of_evaluation_id', 2)
                ->whereNotIn('id', $array_final_id_questions_that_must_have_a_test)
                ->get();

            // Verifica se há mais questões disponíveis do que necessárias
            if ($numPositionsToDraw < count($questionsToChoose)) {
                // Sorteia posições aleatórias
                $drawnPositions = array_rand($questionsToChoose->toArray(), $numPositionsToDraw);

                // Se $drawnPositions for um único valor, converte para um array
                if (!is_array($drawnPositions)) {
                    $drawnPositions = array($drawnPositions);
                }

                // Adiciona os IDs sorteados ao array final
                foreach ($drawnPositions as $position) {
                    $array_final_id_questions_that_must_have_a_test[] = $questionsToChoose[$position]->id;
                }
            }
        }

        return $array_final_id_questions_that_must_have_a_test;
    }

}
