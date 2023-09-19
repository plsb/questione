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

class DepthFirstSearch
{
    // Função para encontrar todos os itens relacionados a partir de um valor inicial
    function encontrarItensRelacionados($valor_inicial, $tabela_relacoes) {
        $itens_relacionados = array();
        $fila = array($valor_inicial);

        while (!empty($fila)) {
            $item = array_shift($fila);

            if (!in_array($item, $itens_relacionados)) {
                $itens_relacionados[] = $item;

                foreach ($tabela_relacoes as $relacao) {
                    $item1 = $relacao->fk_obj1_id;
                    $item2 = $relacao->fk_obj2_id;
                    //list($item1, $item2) = $relacao;

                    if ($item1 == $item && !in_array($item2, $fila) && !in_array($item2, $itens_relacionados)) {
                        $fila[] = $item2;
                    } elseif ($item2 == $item && !in_array($item1, $fila) && !in_array($item1, $itens_relacionados)) {
                        $fila[] = $item1;
                    }
                }
            }
        }

        return $itens_relacionados;
    }

}
