<?php

namespace App;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;
    /*
     nível de acesso:
        0 - aluno
        1 - ADM
        2 - Professor
    */

    protected $table = 'users';
    protected $fillable = ['id', 'name', 'email', 'cpf', 'password','acess_level',
                        'email_verified_at', 'show_tour', 'add_external_question'];
    protected $hidden = ['password', 'cpf'];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function setPasswordAttribute($password)
    {
        if ( !empty($password) ) {
            $this->attributes['password'] = bcrypt($password);
        }
    }

}
