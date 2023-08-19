<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClassBadgesSettings extends Model
{
    protected $table = 'gamification_badges_settings';
    protected $fillable = ['id', 'description_id', 'description', 'PR', 'fk_class_id'];
    protected $hidden = [];

    public function classQuestione(){
        return $this->belongsTo(ClassQuestione::class, 'fk_class_id');
    }

    //'five_correct_questions' 'Atingir 5 questões corretas'
    //'ten_correct_questions' 'Atingir 10 questões corretas'
    //'achieve_first_placement_gold' 'Obter uma posição entre os três primeiros do ranking (ouro)'
    //'achieve_second_placement_silver' 'Obter uma posição entre os três primeiros do ranking (prata)'
    //'achieve_third_placement_bronze' 'Obter uma posição entre os três primeiros do ranking (bronze)'
    //'two_gold_medals' 'Acumular duas medalhas de ouro'
    //'correctly_answer_two_simulations' 'Acertar completamente dois simulados '
    //'answer_a_test_same_day_was_posted' 'Responder um simulado no mesmo dia que foi publicado '
    //'get_100_xp' 'Conseguir 100 pontos de experiência '
}
