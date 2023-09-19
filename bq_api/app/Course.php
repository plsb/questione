<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $table = 'courses';
    protected $fillable = ['id', 'initials', 'description', 'fk_area_id'];
    protected $hidden = [];

    public function regulations(){
        return $this->hasMany(Regulation::class, 'fk_course_id')
            ->orderBy('year', 'desc');
    }

    public function knowledgeArea(){
        return $this->belongsTo(KnowledgeArea::class, 'fk_area_id');
    }

}
