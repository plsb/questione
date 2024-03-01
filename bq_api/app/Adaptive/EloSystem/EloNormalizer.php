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

class EloNormalizer extends Controller
{
    private $minElo = 1000; // Valor mínimo possível para a pontuação Elo
    private $maxElo = 0; // Valor máximo possível para a pontuação Elo


    public function normalizeElo($elo) {
        return 1 - ($elo - $this->minElo) / ($this->maxElo - $this->minElo);
    }

}
