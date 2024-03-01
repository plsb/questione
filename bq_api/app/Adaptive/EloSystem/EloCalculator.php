<?php

namespace App\Adaptive\EloSystem;

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

class EloCalculator extends Controller
{
    public function calculateExpectedScore($ratingA, $ratingB) {
        // Implementação do cálculo da pontuação esperada
        return 1 / (1 + pow(10, ($ratingB - $ratingA) / 400));
    }

}
