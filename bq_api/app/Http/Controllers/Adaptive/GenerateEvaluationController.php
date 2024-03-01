<?php

namespace App\Http\Controllers\Adaptive;

use App\Adaptive\EloSystem\DifficultyAdjuster;
use App\Adaptive\EloSystem\EloCalculator;
use App\Adaptive\EloSystem\EloNormalizer;
use App\Adaptive\EloSystem\EloUpdater;
use App\Adaptive\EloSystem\InitialRatingAssigner;
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
use App\EloScoresStudents;
use App\Evaluation;
use App\EvaluationApplication;
use App\EvaluationHasQuestions;
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
        // Verifica se o ID do curso foi fornecido
        if(!$request->totalQuestionsToGenerateTest){
            return response()->json(['message' => 'Informe o total de questões para compor o simulado.'], 202);
        }

        $total_number_of_questions_to_have_on_a_test = $request->totalQuestionsToGenerateTest; //representa o total de questões que devem ter na prova

        // Verifica se o ID do curso foi fornecido
        if(!$request->fk_class_id){
            return response()->json(['message' => 'Informe a turma.'], 202);
        }

        $class = ClassQuestione::find($request->fk_class_id);
        if(!$class){
            return response()->json(['message' => 'Turma não encontrada.'], 202);
        }

        // Encontra o curso com base no ID fornecido
        $course = Course::find($class->fk_course_id);
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
                $array_final_id_questions_that_must_have_a_test = $questionSelector->selectTestQuestionsByDifficultyAndContent($array_final_id_questions_that_must_have_a_test, $item, $difficultyKey,
                    $total_questions_from_object, $difficultyQty);
            }
        }

        // Se não houver o número necessário de questões, o sistema seleciona aleatoriamente perguntas para compor o teste
        $array_final_id_questions_that_must_have_a_test =
            $questionSelector->selectRandomTestItems($total_number_of_questions_to_have_on_a_test,
                                    $array_final_id_questions_that_must_have_a_test, $regulation);

        // Obtém as questões finais com base nos IDs acumulados
        $final_questions = Question::whereIn('id', $array_final_id_questions_that_must_have_a_test)
            ->with('knowledgeObjects')
            ->select(['id', 'initial_difficulty', 'fk_course_id'])
            ->get();

        if(sizeof($final_questions) == 0){
            return response()->json(['message' => 'O simulado não pôde ser gerado. Quantidade de questões insuficiente.'], 202);
        }

        /*TESTE ETAPA 1 E 2
        $arr_difi_teste = array(0, 0, 0, 0, 0);
        $arr_conteudo = array();
        $knowledge_objects = KnowledgeObject::where('fk_course_id', $course->id)->select('id')->get();
        $list_object_relacted = $this->getListObjectRelated($knowledge_objects);
        foreach ($final_questions as $final_question) {
            foreach ($final_question->knowledgeObjects as $object){
                $id = $object->id;
                // Realizar uma busca em profundidade para encontrar objetos relacionados
                $dfs = new DepthFirstSearch();
                $itens_relacionados = $dfs->encontrarItensRelacionados($id, $list_object_relacted);
                // Encontrar o objeto mais recente
                $id_object_actual = $dfs->findMostRecentObject($itens_relacionados);
                $arr_conteudo[] = $id_object_actual;


            }



            switch ($final_question->initial_difficulty) {
                case 1:
                    $arr_difi_teste[0]++;
                    break;
                case 2:
                    $arr_difi_teste[1]++;
                    break;
                case 3:
                    $arr_difi_teste[2]++;
                    break;
                case 4:
                    $arr_difi_teste[3]++;
                    break;
                case 5:
                    $arr_difi_teste[4]++;
                    break;
            }
        }

        $contagem = array_count_values($arr_conteudo);


        return response()->json([
            $contagem,
        ], 200);*/

        /*
         * GERA O SIMULADO NA BASE DE DADOS
        */
        //cria a avaliação
        $dataHoraAtual = new \DateTime();
        $user = auth('api')->user();

        $evaluation = new Evaluation();
        $evaluation->description = 'Avaliação Expresso '.$dataHoraAtual->format('Y-m-d H:i:s');
        $evaluation->status = 1;
        $evaluation->fk_user_id = $user->id;
        $evaluation->practice = 0;
        $evaluation->save();

        //armazena as questões da avaliação
        foreach ($final_questions as $item){
            $evaluation_question = new EvaluationHasQuestions();
            $evaluation_question->fk_question_id = $item->id;
            $evaluation_question->fk_evaluation_id = $evaluation->id;
            $evaluation_question->save();
        }

        //armazena a aplicação
        do{
            //ano 		Horas/minutos/segundos e id PRofessor
            $token = bin2hex(random_bytes(1));
            $id_evaluation = \mb_strtoupper(substr(date('Y'), -2)."".date('Gis')."".$token);
            $verifyApplication = EvaluationApplication::where('id_application',$id_evaluation)->get();
        } while(sizeof($verifyApplication)>0);

        $evaluation_application = new EvaluationApplication();
        $evaluation_application->id_application = $id_evaluation;
        $evaluation_application->description = 'Simulado Expresso da avaliação '.$evaluation->id.' '.$dataHoraAtual->format('Y-m-d H:i:s');
        $evaluation_application->fk_evaluation_id = $evaluation->id;
        $evaluation_application->fk_class_id = $class->id;
        $evaluation_application->status = 0;
        $evaluation_application->save();


        return response()->json([
            'message' => 'Simulado gerado com sucesso.',
        ], 200);

    }

    public function eloTest(Request $request){
        if(!$request->fk_question_id){
            return response()->json(['message' => 'Informe a questão.'], 202);
        }

        $user = auth('api')->user();

        $assigner = new InitialRatingAssigner();
        $eloCalculator = new EloCalculator();
        $eloUpdater = new EloUpdater();
        $adjuster = new DifficultyAdjuster();
        $eloNormalizer = new EloNormalizer();

        $question = Question::where('id', $request->fk_question_id)
            ->with('knowledgeObjects')
            ->first();
        $objects = $question->knowledgeObjects;

        if(!$objects){
            //a questão não possui conteúdos relacionados
            return ;
        }

        // 1. Atribuir Pontuações Iniciais
        $eloScoreStudentArray = array();
        foreach ($objects as $item){
            $eloScoreVerify = EloScoresStudents::firstOrCreate(
                ['fk_user_id' => $user->id, 'fk_knowledge_objects_id' => $item->id]
            );
            if(!$eloScoreVerify->elo){
                $eloScoreVerify = $assigner->assignInitialRating($eloScoreVerify);
                $eloScoreVerify->save();
            }
            $eloScoreStudentArray[] = $eloScoreVerify;
        }

        if(!$question->elo) $question = $assigner->assignInitialRating($question);
        $question->save();

        // 2. Calcular pontuação esperada e Atualizar Pontuações Elo
        $expectedScore = $eloCalculator->calculateExpectedScore($eloScoreStudentArray[0]->elo, $question->elo);
        $actualScore = 1; // Simulação: Aluno acerta a questão
        $newStudentElo = $eloUpdater->updateElo($eloScoreStudentArray[0]->elo, $expectedScore, $actualScore);
        $newQuestionElo = $eloUpdater->updateElo($question->elo, 1 - $expectedScore, 1 - $actualScore);

        // 3. Ajuste Dinâmico de Dificuldade
        $eloDifferenceQuestion = $newQuestionElo - $question->elo;
        $question = $adjuster->adjustDifficulty($question, $eloDifferenceQuestion);
        $eloDifferenceStudent = $newStudentElo - $eloScoreStudentArray[0]->elo;
        $eloScoreStudentArray[0] = $adjuster->adjustDifficulty($eloScoreStudentArray[0], $eloDifferenceStudent);

        // 4. Atualizar pontuações no banco de dados
        $question->elo = $newQuestionElo;
        $question->save();
        $eloScoreStudentArray[0]->elo = $newStudentElo;
        $eloScoreStudentArray[0]->save();

        // 5. Normalizar pontuações Elo
        $normalizedQuestionElo = $eloNormalizer->normalizeElo($question->elo);

        return response()->json([
            'expectedScore' => $expectedScore,
            'eloNormalized' => $normalizedQuestionElo,
            'eloDifference' => $eloDifferenceQuestion,
            'newStudentElo' => $newStudentElo,
            'newQuestionElo' => $question->elo,
        ], 200);

    }

    private function recommendQuestions($objects, $eloScoreStudentArray, $eloCalculator) {
        $recommendedQuestions = [];

        foreach ($objects as $item) {
            $eloScore = $eloScoreStudentArray[0]->elo; // Use a pontuação do primeiro objeto para simplificar
            $expectedScore = $eloCalculator->calculateExpectedScore($eloScore, $item->elo);

            // Se a pontuação esperada for alta, a questão é recomendada
            if ($expectedScore > 0.7) {
                $recommendedQuestions[] = [
                    'question_id' => $item->id,
                    'question_difficulty' => $item->elo, // Pode ser normalizado se necessário
                ];
            }
        }

        return $recommendedQuestions;
    }


    //apagar depois
    function getListObjectRelated($knowledge_objects) {
        return KnowledgeObjectRelated::whereIn('fk_obj1_id', $knowledge_objects)
            ->orWhereIn('fk_obj2_id', $knowledge_objects)
            ->select('fk_obj1_id', 'fk_obj2_id')
            ->with('object1')
            ->with('object2')
            ->get();
    }

}
