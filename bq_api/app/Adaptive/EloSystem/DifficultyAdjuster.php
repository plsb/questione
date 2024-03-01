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

class DifficultyAdjuster extends Controller
{
    private $upperLimit = 1000; // Limite superior
    private $lowerLimit = 0;  // Limite inferior

    public function adjustDifficulty($object, $eloDifference) {
        $object->elo += $eloDifference;
        $object->elo = max(min($object->elo, $this->upperLimit), $this->lowerLimit);
        return $object;
    }

}
