<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ComentarioItemQuestao extends Model
{
    protected $table = 'comentario_item_questaos';
    protected $fillable = ['id', 'comentario', 'fk_itens_questao_id'];
    protected $hidden = [];
}
