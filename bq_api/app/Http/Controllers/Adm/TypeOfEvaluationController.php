<?php

namespace App\Http\Controllers\Adm;

use App\Question;
use App\TypeOfEvaluation;
use http\Env\Response;
use Illuminate\Http\Request;
use PHPUnit\Util\Type;
use Validator;
use App\Http\Controllers\Controller;

class TypeOfEvaluationController extends Controller
{
    public function __construct()
    {
        $this->middleware(['jwt.auth', 'checkAdm']);
    }

    private $rules = [
        'description' => 'required|max:100|min:4',

    ];

    private $messages = [
        'description.required' => 'A DESCRIÇÃO é obrigatória.',
        'description.max' => 'O máximo de alfanuméricos aceitáveis para a DESCRIÇÃO é 100.',
        'description.min' => 'O minímo de alfanuméricos aceitáveis para a DESCRIÇÃO é 04.',

    ];

    public function index(Request $request)
    {
        if($request->description){
            $typesOfEvaluation = TypeOfEvaluation::where('description', 'like', '%'.$request->description.'%')
                ->orderBy('description')
                ->paginate(10);
        } else {
            $typesOfEvaluation = TypeOfEvaluation::orderBy('description')->paginate(10);
        }

        return response()->json($typesOfEvaluation, 200);
    }

    public function store(Request $request)
    {
        $validation = Validator::make($request->all(),$this->rules, $this->messages);

        if($validation->fails()){
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        $typeOfEvaluation = new TypeOfEvaluation();
        $typeOfEvaluation->description = $request->description;
        $typeOfEvaluation->save();

        return response()->json([
            'message' => 'Tipo de Avaliação '.$typeOfEvaluation->description.' cadastrado.',
            $typeOfEvaluation
        ], 200);
    }

    public function show(int $id)
    {
        $typeOfEvaluation = TypeOfEvaluation::find($id);

        $this->verifyRecord($typeOfEvaluation);

        return response()->json($typeOfEvaluation, 200);
    }

    public function update(Request $request, $id)
    {
        $validation = Validator::make($request->all(), $this->rules, $this->messages);

        if($validation->fails()){
            $erros = array('errors' => array(
                $validation->messages()
            ));
            $json_str = json_encode($erros);
            return response($json_str, 202);
        }

        $typeOfEvaluation = TypeOfEvaluation::find($id);

        $this->verifyRecord($typeOfEvaluation);

        $typeOfEvaluation->description = $request->description;
        $typeOfEvaluation->save();

        return response()->json([
            'message' => 'Tipo de Avaliação '.$typeOfEvaluation->description.' atualizado.',
            $typeOfEvaluation
        ], 200);
    }

    public function destroy($id)
    {
        $typeOfEvaluation = TypeOfEvaluation::find($id);

        $this->verifyRecord($typeOfEvaluation);

        $questions = Question::where('fk_type_of_evaluation_id', '=', $id)->get();
        if(sizeof($questions)>0) {
            return response()->json(['message' => 'Operação não realizada. Existem questões para este tipo de avaliação.'], 202);
        }

        $typeOfEvaluation->delete();

        return response()->json([
            'message' => 'Tipo de Avaliação '.$typeOfEvaluation->description.' excluído.',
            $typeOfEvaluation
        ], 200);
    }

    public function verifyRecord($record){
        if(!$record || $record == '[]'){
            return response()->json([
                'message' => 'Registro não encontrado.'
            ], 202);
        }
    }
}
