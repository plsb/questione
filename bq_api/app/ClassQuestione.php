<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClassQuestione extends Model
{
    protected $table = 'class';
    protected $fillable = ['id', 'id_class', 'description', 'status', 'fk_usuario_id'];
    protected $hidden = [];

    public function user(){
        return $this->belongsTo(User::class, 'fk_user_id');
    }
}
