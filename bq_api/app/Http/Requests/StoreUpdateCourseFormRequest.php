<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUpdateCourseFormRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'initials' => 'required|max:8|min:2',
            'description' => 'required|max:100|min:4',
        ];
    }

    public function messages(){
        return [
            'initials.required' => 'A SILGA é obrigatória.',
            'initials.max' => 'O máximo de caracteres aceitáveis para a SIGLA é 08.',
            'initials.min' => 'O minímo de caracteres aceitáveis para a SIGLA é 02.',

            'description.required' => 'A DESCRIÇÃO é obrigatório.',
            'description.max' => 'O máximo de alfanuméricos aceitáveis para a DESCRIÇÃO é 100.',
            'description.min' => 'O minímo de alfanuméricos aceitáveis para a DESCRIÇÃO é 04.',
        ];
    }
}
