<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RespostasAvaliacaoAluno extends Model
{
    protected $table = 'respostas';
    protected $fillable = [
    		'id',
    		'resposta',
    		'fk_avaliacao_questao_id',
    		'fk_aluno_id',
    		'fk_aplicacao_avaliacao_id'];
    //'fk_avaliacao_questao_avaliacao_id',
    protected $hidden = [];
}
