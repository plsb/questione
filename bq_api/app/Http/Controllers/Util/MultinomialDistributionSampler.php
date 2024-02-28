<?php

namespace App\Http\Controllers\Util;

use App\ClassQuestione;
use App\ClassStudents;
use App\Course;
use App\CourseProfessor;
use App\Evaluation;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;
use DB;

class MultinomialDistributionSampler
{
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

}
