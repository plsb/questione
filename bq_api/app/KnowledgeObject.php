<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class KnowledgeObject extends Model
{
    protected $table = 'knowledge_objects';
    protected $fillable = ['id', 'description', 'fk_course_id', 'fk_regulation_id'];
    protected $hidden = [];

    public function course(){
        return $this->belongsTo(Course::class, 'fk_course_id');
    }

    public function regulation(){
        return $this->belongsTo(Regulation::class, 'fk_regulation_id');
    }
}
