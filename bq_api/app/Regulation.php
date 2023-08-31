<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Regulation extends Model
{
    protected $table = 'regulation';
    protected $fillable = ['id', 'description', 'year','fk_course_id'];
    protected $hidden = [];

    public function course(){
        return $this->belongsTo(Course::class, 'fk_course_id');
    }

    public function knowledgeObject(){
        return $this->hasMany(KnowledgeObject::class, 'fk_regulation_id')
            ->with('related1')
            ->with('related2')
            ->orderBy('description');
    }


}
