<?php

namespace App\Http\Controllers;

use App\Notifications\WelcomeNotifications;
use App\User;
use Illuminate\Http\Request;
use Validator;

class AuthController extends Controller
{

    public function __construct()
    {
        //$this->middleware(['cors']);
    }

    private $rules = [
        'name' => 'required|max:50|min:8',
        // 'cpf' => 'required|unique:users',
        'email' => 'required|unique:users',
        'password' => 'required|max:10|min:6'
    ];

    private $messages = [
        'name.required' => 'O NOME DO USUÁRIO é obrigatório.',
        'name.max' => 'O máximo de caracteres aceitáveis para o NOME DO USUÁRIO é 50.',
        'name.min' => 'O minímo de caracteres aceitáveis para o NOME DO USUÁRIO é 8.',

        // 'cpf.required' => 'O CPF DO USUÁRIO é obrigatório.',
        // 'cpf.unique' => 'O CPF DO USUÁRIO já está cadastrado.',

        'email.required' => 'O E-MAIL DO USUÁRIO é obrigatório.',
        'email.unique' => 'O E-MAIL DO USUÁRIO já está cadastrado.',
        'email.email' => 'O EMAIL DO USUÁRIO não é válido.',

        'password.required' => 'O PASSWORD DO USUÁRIO é obrigatório.',
        'password.max' => 'O máximo de alfanuméricos aceitáveis para o PASSWORD DO USUÁRIO é 10.',
        'password.min' => 'O minímo de alfanuméricos aceitáveis para o PASSWORD DO USUÁRIO é 6.',
    ];

    public function register(Request $request)
    {
        $validation = Validator::make($request->all(), $this->rules, $this->messages);

        if($validation->fails())
        {
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        // if(!$this->verifyCPFValid($request->cpf))
        // {
        //     return response()->json(['message' => 'CPF Inválido!'], 202);
        // }

        if(!$this->verifyEmailValid($request->email))
        {
            return response()->json(['message' => 'E-mail Inválido!'], 202);
        }



        $user = User::create([
            'name'    => strtoupper($request->name),
            'email'    => strtolower($request->email),
            'password' => $request->password,
            'acess_level' => 0,
        ]);
        $user->notify(new WelcomeNotifications($user));

        return response()->json([$user], 200);
    }

    public function login(Request $request)
    {
        $credentials = request(['email', 'password']);

        if(!$request->email ||  !$request->password)
        {
            return response()->json(['message' => 'Informe e-mail e senha.'], 202);
        }

        if (! $token = auth()
            ->setTTL(1800)
            ->attempt($credentials))
        {
            return response()->json(['message' => 'Acesso não autorizado.'], 202);
        }

        $user = User::where('email', '=', $request->email)->first();

        return $this->respondWithToken($token, $user);
    }

    public function logout(Request $request)
    {
        if(!$request->token)
        {
            return response()->json(['message' => 'Não foi informado o token.'], 202);
        }
        auth()->logout();

        return response()->json(['message' => 'Sucesso ao realizar logout.'], 200);
    }

    protected function respondWithToken($token, $user)
    {
        return response()->json([
            'token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth()->factory()->getTTL() * 60,
            $user
        ], 200);
    }

    //Função de Validar CPF
    public function verifyCPFValid($cpf) {

        // Verifica se um número foi informado
        if(empty($cpf)) {
            return false;
        }

        // Elimina possivel mascara
        $cpf = preg_replace("/[^0-9]/", "", $cpf);
        $cpf = str_pad($cpf, 11, '0', STR_PAD_LEFT);

        // Verifica se o numero de digitos informados é igual a 11
        if (strlen($cpf) != 11) {
            return false;
        }
        // Verifica se nenhuma das sequências invalidas abaixo
        // foi digitada. Caso afirmativo, retorna falso
        else if ($cpf == '00000000000' ||
            $cpf == '11111111111' ||
            $cpf == '22222222222' ||
            $cpf == '33333333333' ||
            $cpf == '44444444444' ||
            $cpf == '55555555555' ||
            $cpf == '66666666666' ||
            $cpf == '77777777777' ||
            $cpf == '88888888888' ||
            $cpf == '99999999999') {
            return false;
            // Calcula os digitos verificadores para verificar se o
            // CPF é válido
        } else {

            for ($t = 9; $t < 11; $t++) {

                for ($d = 0, $c = 0; $c < $t; $c++) {
                    $d += $cpf{$c} * (($t + 1) - $c);
                }
                $d = ((10 * $d) % 11) % 10;
                if ($cpf{$c} != $d) {
                    return false;
                }
            }

            return true;
        }
    }

    public function verifyEmailValid($email){
        if(filter_var($email, FILTER_VALIDATE_EMAIL)){
            return true;
        } else {
            return false;
        }
    }
}
