<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class EloScoresStudents extends Model
{
    protected $table = 'elo_scores_students';
    protected $fillable = ['id', 'fk_user_id', 'fk_knowledge_objects_id', 'elo'];
    protected $hidden = [];

    public function user(){
        return $this->belongsTo(User::class, 'fk_user_id');
    }

    public function knowledgeObjects(){
        return $this->belongsTo(KnowledgeObject::class, 'fk_knowledge_objects_id');
    }


}
