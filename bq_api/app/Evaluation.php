<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    protected $table = 'evaluations';
    protected $fillable = ['id', 'description', 'id_evaluation', 'fk_user_id',
                                     'students_can_see_fedback', 'studentes_can_see_comments_items'];
    protected $hidden = [];

    /*public function questions(){
        return $this->belongsToMany(Question::class, 'avaliacao_questao', 'fk_avaliacao_id', 'fk_questao_id')
        	->as('avaliacao_questao')
            ->withPivot('id')
            ->with('objetos_de_conhecimento')
            ->withTimestamps();
    }*/

    /*public function aplicacoes(){
    	return $this->hasMany(AplicacaoAvaliacao::class, 'fk_avaliacao_id');
    }*/

    public function user(){
        return $this->belongsTo(User::class, 'fk_user_id');
    }


}
