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
    public function selectQuestionsToComposeTest($item, $property, &$totalQuestionsFromObject, &$quantityDifficulty)
    {
        $selectedQuestions = [];

        // Verifica se a propriedade existe e se há perguntas restantes para selecionar
        if (property_exists($item, $property) && $totalQuestionsFromObject > 0 && $quantityDifficulty > 0) {
            $totalSub = 0;
            $countDifficulty = count($item->$property);

            // Se houver menos questões disponíveis do que o necessário, selecione todas disponíveis
            if ($countDifficulty < $totalQuestionsFromObject) {
                $selectedQuestions = array_merge($selectedQuestions, $item->$property);
                $totalSub = $countDifficulty;
            } else {
                // Seleciona índices aleatórios se houver questões suficientes disponíveis
                $randomIndices = is_array($tmp = array_rand($item->$property, $totalQuestionsFromObject))
                    ? $tmp
                    : [$tmp];

                // Adiciona as perguntas selecionadas ao array
                foreach ($randomIndices as $value) {
                    $selectedQuestions[] = $item->$property[$value];
                }

                $totalSub = $totalQuestionsFromObject;
            }

            // Atualiza as quantidades restantes
            $quantityDifficulty -= $totalSub;
            $totalQuestionsFromObject -= $totalSub;
        }

        return $selectedQuestions;
    }

}
