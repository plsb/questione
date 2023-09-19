<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class KnowledgeArea extends Model
{
    protected $table = 'knowledge_area';
    protected $fillable = ['id', 'description'];
    protected $hidden = [];

}
