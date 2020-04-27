<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class QuestionItem extends Model
{
    protected $table = 'question_itens';
    protected $fillable = ['id', 'description', 'correct_item', 'fk_question_id'];
    protected $hidden = [];

    /*public function comentarios(){
        return $this->hasMany(ComentarioItemQuestao::class, 'fk_itens_questao_id');
    }*/
}
