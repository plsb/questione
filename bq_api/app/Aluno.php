<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use \Illuminate\Foundation\Application;

class Aluno extends Model
{
    protected $table = 'alunos';
    protected $fillable = ['id', 'nome'];
    protected $hidden = [];
}
