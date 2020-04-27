<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $table = 'courses';
    protected $fillable = ['id', 'initials', 'description'];
    protected $hidden = [];

    /*public function perfis(){
    	return $this->hasMany(Perfil::class, 'fk_curso_id');
    }


    public function competencias(){
    	return $this->hasMany(Competencia::class, 'fk_curso_id');
    }


    public function objetos_de_conhecimento(){
    	return $this->hasMany(ObjetoDeConhecimento::class, 'fk_curso_id');
    }

    public function professores_do_curso(){
        return $this->belongsToMany(User::class, 'professor_curso', 'fk_curso_id', 'fk_usuario_id')
        ->wherePivot('validado', 1);
    }*/

}
