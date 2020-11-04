<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUpdateSkillFormRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'description' => 'required|max:300|min:10',
            'fk_course_id' => 'required',
        ];
    }

    public function messages(){
        return [
            'description.required' => 'A DESCRIÇÃO é obrigatória.',
            'description.max' => 'O máximo de caracteres aceitáveis para a DESCRIÇÃO é 300.',
            'description.min' => 'O minímo de caracteres aceitáveis para a DESCRIÇÃO é 10.',

            'fk_course_id.required' => 'O CURSO é obrigatório.',
        ];
    }
}
