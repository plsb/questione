<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class QuestionHasKnowledgeObject extends Model
{
    protected $table = 'question_knowledge_objects';
    protected $fillable = ['id', 'fk_question_id', 'fk_knowledge_object'];
    protected $hidden = [];
}
