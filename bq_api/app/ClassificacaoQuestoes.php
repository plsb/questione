<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClassificacaoQuestoes extends Model
{
    protected $table = 'classificacao_questoes';
    protected $fillable = ['id', 'classificacao', 'fk_usuario_id', 'fk_questao_id'];
    protected $hidden = [];

    public function usuario(){
        return $this->belongsTo(User::class, 'fk_usuario_id');
    }

    public function questao(){
        return $this->belongsTo(Question::class, 'fk_questao_id');
    }


}
