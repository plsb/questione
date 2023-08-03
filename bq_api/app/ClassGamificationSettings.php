<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClassGamificationSettings extends Model
{
    protected $table = 'class_gamification_settings';
    protected $fillable = ['id', 'description_id', 'description', 'XP', 'PR', 'fk_class_id'];
    protected $hidden = [];

    public function classQuestione(){
        return $this->belongsTo(ClassQuestione::class, 'fk_class_id');
    }

    //'correctly_mark_all_questions' 'Acertar todas as questões de um simulado'
//'mark_correct_question' 'Acertar cada questão do teste'
//'complete_a_test' 'Finalizar um simulado'
//'enter_class' 'Ingressar em uma turma'
//'get_badge' 'Conquistar emblema'
}
