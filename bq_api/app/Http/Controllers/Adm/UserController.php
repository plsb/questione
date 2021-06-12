<?php

namespace App\Http\Controllers\Adm;

use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkAdm']);
    }

    public function index(Request $request)
    {
        if($request->name){
            $users = User::where('name', 'like', '%'.$request->name.'%')->orderBy('name')->paginate(10);
        } else {
            $users = User::orderBy('name')->paginate(10);
        }
        return response()->json($users, 200);
    }

    public function addExternalQuestion(Request $request, $id){
        $user = User::find($id);

        if(!$request->add_external_question){
            return response()->json([
                'message' => 'Informe o campo.'
            ], 202);
        }
        $user->add_external_question = $request->add_external_question;
        $user->save();

        return response()->json([
            'message' => 'Usuário editado com sucesso.'
        ], 200);

    }

    public function isProfessor(Request $request, $id)
    {
        //Ativa ou desativa o usuário como professor
        $user = User::find($id);

        if($user->is_professor == 0) {
            $user->is_professor = 1;
        } else {
            $user->is_professor = 0;
        }

        $user->save();

        return response()->json($user);

    }
}
