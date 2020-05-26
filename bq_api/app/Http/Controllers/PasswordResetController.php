<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Jobs\SendEmailPasswordResert;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Notifications\PasswordResetRequestNotifications;
use App\Notifications\PasswordResetSuccessNotifications;
use App\User;
use App\PasswordReset;
use Validator;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    /**
     * Create token password reset
     *
     * @param  [string] email
     * @return [string] message
     */
    public function redefinePassword(Request $request){
        $rules = [
            'email' => 'required|string|email',
        ];

        $messages = [
            'email.required' => 'O EMAIL DO USUÁRIO é obrigatório.',
            'email.email' => 'O EMAIL DO USUÁRIO não é válido.',
        ];


        $validation = Validator::make($request->all(),$rules, $messages);

        if($validation->fails()){
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user)
            return response()->json([
                'message' => 'O endereço de EMAIL não pertence a um usuário.'], 202);
        $passwordReset = PasswordReset::updateOrCreate(
            ['email' => $user->email],
            [
                'email' => $user->email,
                'token' => Str::random(60)
             ]
        );
        if ($user && $passwordReset)
            $user->notify(
                new PasswordResetRequestNotifications($passwordReset->token, $user)
            );
        return response()->json([
            'message' => 'O link de redefinição de senha será enviado para o e-mail '
                                    .$user->email.'.'
        ], 200);
    }
    /**
     * Find token password reset
     *
     * @param  [string] $token
     * @return [string] message
     * @return [json] passwordReset object
     */
    public function find($token)
    {
        $passwordReset = PasswordReset::where('token', $token)
            ->first();
        if (!$passwordReset)
            return response()->json([
                'message' => 'O token de redefinição de senha é inválido.'
            ], 202);
        if (Carbon::parse($passwordReset->updated_at)->addMinutes(720)->isPast()) {
            $passwordReset->delete();
            return response()->json([
                'message' => 'O token de redefinição de senha é inválido.'], 202);
        }

        return response()->json($passwordReset, 200);
    }
     /**
     * Reset password
     *
     * @param  [string] email
     * @param  [string] password
     * @param  [string] password_confirmation
     * @param  [string] token
     * @return [string] message
     * @return [json] user object
     */
    public function reset(Request $request)
    {

         $rules = [
             'email' => 'required|string|email',
             'password' => 'required|max:10|min:6',
             'token' => 'required|string',
        ];

         $messages = [
            'email.required' => 'O EMAIL DO USUÁRIO é obrigatório.',
            'email.email' => 'O EMAIL DO USUÁRIO não é válido.',

            'password.required' => 'O PASSWORD DO USUÁRIO é obrigatório.',
            'token.required' => 'O TOKEN DO USUÁRIO é obrigatório.',
        ];


        $validation = Validator::make($request->all(),$rules, $messages);

        if($validation->fails()){
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        $passwordReset = PasswordReset::where([
            ['token', $request->token],
            ['email', $request->email]
        ])->first();
        if (!$passwordReset)
            return response()->json([
                'message' => 'O token de redefinição de senha é inválido.'
            ], 202);
        $user = User::where('email', $passwordReset->email)->first();
        if (!$user)
            return response()->json([
                'message' => 'O endereço de EMAIL não pertence a um usuário.'
            ], 202);
        $user->password = $request->password;
        if($user->email_verified_at == null) {
            $user->email_verified_at = date('Y-m-d H:i:s');
        }
        $user->save();
        $passwordReset->delete();
        $user->notify(new PasswordResetSuccessNotifications($user));
        return response()->json([
            'message' => 'Redefinição de senha realizada com sucesso.',
            $user], 200);
    }
}
