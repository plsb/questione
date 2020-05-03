<?php

namespace App\Http\Controllers;

use App\Course;
use Illuminate\Http\Request;
use Validator;

class AllUsers extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth']);
    }

    public function courses()
    {
        $courses = Course::orderBy('description')->get();

        return response()->json($courses, 200);
    }

    private $rulesUser = [
        'name' => 'required|max:50|min:8',
        'password' => 'required|max:10|min:6'
    ];

    private $messagesUser = [
        'name.required' => 'O NOME DO USUÁRIO é obrigatório.',
        'name.max' => 'O máximo de caracteres aceitáveis para o NOME DO USUÁRIO é 50.',
        'name.min' => 'O minímo de caracteres aceitáveis para o NOME DO USUÁRIO é 8.',

        'password.required' => 'O PASSWORD DO USUÁRIO é obrigatório.',
        'password.max' => 'O máximo de alfanuméricos aceitáveis para o PASSWORD DO USUÁRIO é 10.',
        'password.min' => 'O minímo de alfanuméricos aceitáveis para o PASSWORD DO USUÁRIO é 6.',
    ];

    public function updateProfileUser(Request $request)
    {
        $validation = Validator::make($request->all(),$this->rulesUser, $this->messagesUser);

        if($validation->fails()){
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        $user = auth('api')->user();
        $user->name = $request->name;
        $user->password = $request->password;
        $user->save();

        return response()->json([
            'message' => 'Usuário atualizado.',
            $user
        ], 200);
    }
}
