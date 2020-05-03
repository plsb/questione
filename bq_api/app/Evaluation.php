<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    protected $table = 'evaluations';
    protected $fillable = ['id', 'description', 'fk_user_id'];
    protected $hidden = [];

    public function questions(){
        return $this->belongsToMany(Question::class, 'evaluation_questions',
                    'fk_evaluation_id', 'fk_question_id')
        	->as('questions')
            ->withPivot('id')
            ->withTimestamps();
    }

    /*public function aplicacoes(){
    	return $this->hasMany(AplicacaoAvaliacao::class, 'fk_avaliacao_id');
    }*/

    public function user(){
        return $this->belongsTo(User::class, 'fk_user_id');
    }


}
