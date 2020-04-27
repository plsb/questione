<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Notifications\PasswordResetRequest;
use App\Notifications\PasswordResetSuccess;
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
            return $validation->errors()->toJson();
        }

        $user = User::where('email', $request->email)->first();
        if (!$user)
            return response()->json([
                'message' => 'O endereo de EMAIL não pertence a um usuário.'], 404);
        $passwordReset = PasswordReset::updateOrCreate(
            ['email' => $user->email],
            [
                'email' => $user->email,
                'token' => Str::random(60)
             ]
        );
        if ($user && $passwordReset)
            $user->notify(
                new PasswordResetRequest($passwordReset->token)
            );
        return response()->json([
            'message' => 'O link de redefinição de senha foi enviado para o e-mail.'
        ]);
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
                'message' => 'Este token de redefinição de senha é inválido.'
            ], 404);
        if (Carbon::parse($passwordReset->updated_at)->addMinutes(720)->isPast()) {
            $passwordReset->delete();
            return response()->json([
                'message' => 'Este token de redefinição de senha é inválido.'], 404);
        }

        return response()->json($passwordReset);
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
            return $validation->errors()->toJson();
        }

        $passwordReset = PasswordReset::where([
            ['token', $request->token],
            ['email', $request->email]
        ])->first();
        if (!$passwordReset)
            return response()->json([
                'message' => 'Este token de redefinição de senha é inválido.'
            ], 404);
        $user = User::where('email', $passwordReset->email)->first();
        if (!$user)
            return response()->json([
                'message' => 'O endereo de EMAIL não pertence a um usuário.'
            ], 404);
        $user->password = $request->password;
        $user->save();
        $passwordReset->delete();
        $user->notify(new PasswordResetSuccess($passwordReset));
        return response()->json($user);
    }
}
