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

class QuestionDifficultyCalculator extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkProfessor']);
    }

    /**
     * Calcula o número total de questões por dificuldade com base em critérios específicos.
     *
     * @param int   $totalQuestions    O número total de questões desejadas.
     * @param array $arrayDifficulty   O array contendo os níveis de dificuldade das questões.
     * @param array $regulation        O array contendo as regulamentações associadas ao curso.
     * @param int   $totalRegulation   O número total de regulamentações associadas ao curso.
     *
     * @return array O array contendo o número de questões selecionadas para cada nível de dificuldade.
     */
    function calculatesQuestionsDifficulty($totalQuestions, $arrayDifficulty, $regulation, $totalRegulation)
    {
        $arrayPercDifficulty = [];
        $sumAvgGeneralDifficulty = 0;

        // Loop sobre os níveis de dificuldade especificados
        foreach ($arrayDifficulty as $value) {
            // Calcula o número total de questões para o nível de dificuldade atual
            $totalDifficulty = Question::whereIn('fk_regulation_id', $regulation)
                ->where('fk_type_of_evaluation_id', 2)
                ->where('initial_difficulty', $value)
                ->count();

            // Calcula a média de questões para o nível de dificuldade atual em relação ao total de regulamentações
            $avgQuestionsByDifficulty = $totalDifficulty / $totalRegulation;
            $arrayPercDifficulty[] = $avgQuestionsByDifficulty;

            $sumAvgGeneralDifficulty += $avgQuestionsByDifficulty;
        }

        // Normaliza as percentagens para garantir que somem 1
        $arrayPercDifficulty = array_map(function ($perc) use ($sumAvgGeneralDifficulty) {
            return round($perc / $sumAvgGeneralDifficulty, 2);
        }, $arrayPercDifficulty);

        // Utiliza um amostrador multinomial para obter o número de questões por dificuldade
        $multinomialSampler = new MultinomialDistributionSampler();
        return $multinomialSampler->multinomialSample($totalQuestions, $arrayPercDifficulty);
    }

}
