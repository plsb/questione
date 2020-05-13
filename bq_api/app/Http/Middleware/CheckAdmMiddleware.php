<?php

namespace App\Http\Middleware;

use Closure;

class CheckAdmMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = auth('api')->user();
        if($user->acess_level != 1){
            return response()->json([
                'message' => 'O usuário não tem permissão para o recurso solicitado.'
            ], 401);
        } else {
            return $next($request);
        }
    }
}
