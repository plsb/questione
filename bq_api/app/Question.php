<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $table = 'questions';
    protected $fillable = ['id', 'base_text', 'stem', 'validated', 'reference','fk_profile_id',
                                        'fk_skill_id', 'fk_user_id', 'fk_course_id'];
    protected $hidden = [];

    public function profile(){
    	return $this->belongsTo(Profile::class, 'fk_profile_id');
    }

    public function skill(){
    	return $this->belongsTo(Skill::class, 'fk_skill_id');
    }

    public function course(){
        return $this->belongsTo(Course::class, 'fk_course_id');
    }

    public function user(){
        return $this->belongsTo(User::class, 'fk_user_id');
    }

    public function knowledgeObjects(){
        return $this->belongsToMany(KnowledgeObject::class, 'question_knowledge_objects',
                                            'fk_question_id', 'fk_knowledge_object')
            ->withPivot('fk_question_id')
            ->withPivot('fk_knowledge_object')
            ->withTimestamps();
    }

    public function questionItems(){
        return $this->hasMany(QuestionItem::class, 'fk_question_id');
    }

    public function rank(){
        return $this->belongsToMany(User::class, 'rank_question',
            'fk_question_id', 'fk_user_id')
            ->withPivot('rank')
            ->withTimestamps();
    }

    /*
    public function professores_valida_questao(){
        return $this->belongsToMany(User::class, 'professor_valida_questao',
                                    'fk_questao_id', 'fk_usuario_id')
            ->withPivot('id')
            ->withPivot('aceita')
            ->withPivot('rejeitada')
            ->withPivot('modificacao_solicitada')
            ->withTimestamps();
    }

    public function lista_todas_classificacao(){
        return $this->hasMany(ClassificacaoQuestoes::class, 'fk_questao_id');
    }

    public function modificacoes(){
        return $this->hasMany(Modificacao::class, 'fk_questao_id');
    }*/
}
