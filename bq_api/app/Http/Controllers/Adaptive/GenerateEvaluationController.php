<?php

namespace App\Http\Controllers\Adaptive;

use App\Adaptive\KnowledgeObjectAssessmentManager;
use App\Adaptive\QuestionDifficultyCalculator;
use App\Adaptive\QuestionSelector;
use App\ClassBadgesSettings;
use App\ClassGamificationScoreSettings;
use App\ClassGamificationSettings;
use App\ClassQuestione;
use App\ClassStudents;
use App\Course;
use App\CourseProfessor;
use App\Http\Controllers\Gamification\PointSystemController;
use App\Http\Controllers\Util\DepthFirstSearch;
use App\Http\Controllers\Util\MultinomialDistributionSampler;
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

    /**
     * Função para gerar uma prova com base em requisitos específicos.
     *
     * @param Request $request Requisição contendo informações necessárias.
     *
     * @return \Illuminate\Http\JsonResponse Resposta JSON com resultados e mensagens.
     */
    public function generate(Request $request)
    {
        $total_number_of_questions_to_have_on_a_test = 10; //representa o total de questões que devem ter na prova

        // Verifica se o ID do curso foi fornecido
        if(!$request->fk_course_id){
            return response()->json(['message' => 'Informe o curso.'], 202);
        }

        // Encontra o curso com base no ID fornecido
        $course = Course::find($request->fk_course_id);
        if(!$course){
            return response()->json(['message' => 'Curso não encontrado.'], 202);
        }

        // Obtém as portarias relacionadas ao curso
        $regulation = Regulation::where('fk_course_id', $course->id)->select('id')->get();
        if(!$regulation){
            return response()->json(['message' => 'O curso não possui portarias cadastradas.'], 202);
        }

        // Calcula o total de portarias
        $totalRegulation = sizeof($regulation);

        // Define os níveis de dificuldade na prova
        $array_difficulty = array(1, 2, 3, 4, 5);

        // Calcula o total de questões por dificuldade
        $questionDifficultyCalculator = new QuestionDifficultyCalculator();
        $array_total_questions_by_difficulty = $questionDifficultyCalculator->calculatesQuestionsDifficulty($total_number_of_questions_to_have_on_a_test, $array_difficulty, $regulation, $totalRegulation);

        // Instancia o gerenciador para cálculos relacionados aos objetos de conhecimento
        $questionByObject = new KnowledgeObjectAssessmentManager();

        // Calcula o total de questões por objeto de conhecimento
        $array_total_questions_by_object = $questionByObject->calculatesTotalQuestionsByObject($total_number_of_questions_to_have_on_a_test, $course, $regulation, $totalRegulation);

        // Filtra os objetos que devem estar na prova
        $array_objects_that_must_be_in_the_test = array_filter($array_total_questions_by_object, function ($item) {
            return $item->number_questions_in_the_evaluation > 0;
        });
        /*
         * Geração da prova
         */

        // Loop para criar variáveis dinâmicas de quantidade de questões por dificuldade
        for ($i = 1; $i <= 5; $i++) {
            /*
             * Cria uma variável dinâmica com o nome "qtd_questoes_dificuldade_" concatenado com o valor de $i
             * Atribui o valor correspondente do array ao nome da variável dinâmica
             */
            ${"qtd_questions_difficulty_" . $i} = $array_total_questions_by_difficulty[$i - 1];
        }

        // Prioridades de dificuldade em um array associativo
        $difficultyPriorities = [
            'questions_difficulty_1' => $qtd_questions_difficulty_1,
            'questions_difficulty_5' => $qtd_questions_difficulty_5,
            'questions_difficulty_2' => $qtd_questions_difficulty_2,
            'questions_difficulty_3' => $qtd_questions_difficulty_3,
            'questions_difficulty_4' => $qtd_questions_difficulty_4,
        ];

        // Array para armazenar IDs das questões que devem fazer parte do teste
        $array_final_id_questions_that_must_have_a_test = array();

        // Loop sobre os objetos que devem estar no teste
        $questionSelector = new QuestionSelector();
        foreach ($array_objects_that_must_be_in_the_test as $item) {
            $total_questions_from_object = $item->number_questions_in_the_evaluation;

            // Loop sobre as prioridades de dificuldade
            foreach ($difficultyPriorities as $difficultyKey => $difficultyQty) {
                // Adiciona IDs de questões ao array final
                $array_final_id_questions_that_must_have_a_test = array_merge(
                    $array_final_id_questions_that_must_have_a_test,
                    $questionSelector->selectQuestionsToComposeTest($item, $difficultyKey, $total_questions_from_object, $difficultyQty)
                );
            }
        }

        // Obtém as questões finais com base nos IDs acumulados
        $final_questions = Question::whereIn('id', $array_final_id_questions_that_must_have_a_test)
            ->with('knowledgeObjects')
            ->select(['id', 'initial_difficulty', 'fk_course_id'])
            ->get();

        return response()->json([$array_total_questions_by_difficulty, count($array_final_id_questions_that_must_have_a_test), $final_questions], 200);

    }

}
