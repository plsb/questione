<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use \Illuminate\Foundation\Application;

class KeywordQuestion extends Model
{
    protected $table = 'keywords_question';
    protected $fillable = ['id', 'keyword', 'fk_question_id'];
    protected $hidden = [];

}
