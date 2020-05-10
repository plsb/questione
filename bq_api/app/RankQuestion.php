<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RankQuestion extends Model
{
    protected $table = 'rank_question';
    protected $fillable = ['id', 'rank', 'fk_user_id', 'fk_question_id'];
    protected $hidden = [];

    public function user(){
        return $this->belongsTo(User::class, 'fk_user_id');
    }

    public function question(){
        return $this->belongsTo(Question::class, 'fk_question_id');
    }


}
