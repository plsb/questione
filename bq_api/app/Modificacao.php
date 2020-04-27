<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Modificacao extends Model
{
    protected $table = 'modificacoes';
    protected $fillable = ['id', 'descricao_modificacao', 'visualizado', 'fk_questao_id', 'fk_usuario_id'];
    protected $hidden = [];

    public function usuario(){
        return $this->belongsTo(User::class, 'fk_usuario_id');
    }
}
