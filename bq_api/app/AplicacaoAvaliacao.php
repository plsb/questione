<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AplicacaoAvaliacao extends Model
{
    protected $table = 'aplicacao_avaliacao';
    protected $fillable = ['id', 'fk_avaliacao_id'];
    protected $hidden = [];
}
