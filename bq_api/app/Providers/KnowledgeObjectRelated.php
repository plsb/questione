<?php

namespace App\Providers;

use App\Course;
use App\KnowledgeObject;
use App\Regulation;
use Illuminate\Database\Eloquent\Model;

class KnowledgeObjectRelated extends Model
{
    protected $table = 'knowledge_objects_related';
    protected $fillable = ['id', 'fk_obj1_id', 'fk_obj2_id'];
    protected $hidden = [];

    public function object1(){
        return $this->belongsTo(KnowledgeObject::class, 'fk_obj1_id')
            ->with('regulation')
            ->with('course');
    }

    public function object2(){
        return $this->belongsTo(KnowledgeObject::class, 'fk_obj2_id')
            ->with('regulation')
            ->with('course');
    }
}
