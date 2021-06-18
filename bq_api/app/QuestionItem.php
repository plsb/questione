<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class QuestionItem extends Model
{
    protected $table = 'question_itens';
    protected $fillable = ['id', 'description', 'correct_item', 'fk_question_id'];
    protected $hidden = [''];

}
