<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProfessorLecionaCurso extends Model
{
    protected $table = 'professor_curso';
    protected $fillable = ['id', 'fk_usuario_id', 'fk_curso_id', 'comprovante', 'validado'];
    protected $hidden = [];
}
