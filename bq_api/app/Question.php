<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $table = 'questions';
    protected $fillable = ['id', 'base_text', 'stem', 'validated', 'reference',
                                        'year', 'fk_type_of_evaluation_id',
                                        'fk_skill_id', 'fk_user_id', 'fk_course_id'];
    protected $hidden = [];

    public function typeOfEvaluation(){
        return $this->belongsTo(TypeOfEvaluation::class, 'fk_type_of_evaluation_id');
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

    public function questionItemsWithoutCorrect(){
        return $this->hasMany(QuestionItem::class, 'fk_question_id')->select('id', 'description', 'fk_question_id');
    }

    public function rank(){
       return $this->hasMany(RankQuestion::class, 'fk_question_id');
    }

    public function rankAvg(){
        return $this->hasMany(RankQuestion::class, 'fk_question_id')
            ->selectRaw('ROUND(avg(rank)) as rank_avg, fk_question_id')
            ->groupBy('fk_question_id');
    }

    public function rankByUserActive(){
        $user = auth('api')->user();
        $rank = $this->hasMany(RankQuestion::class, 'fk_question_id')
            ->where('fk_user_id', [$user->id]);
        return $rank;
    }

    public function difficultyByUserActive(){
        $user = auth('api')->user();
        $difficulty = $this->hasMany(DifficultyQuestion::class, 'fk_question_id')
            ->where('fk_user_id', [$user->id]);
        return $difficulty;
    }

    public function keywords(){
        return $this->hasMany(KeywordQuestion::class, 'fk_question_id');
    }
}
