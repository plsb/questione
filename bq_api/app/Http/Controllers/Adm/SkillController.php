<?php

namespace App\Http\Controllers\Adm;

use App\Http\Requests\StoreUpdateSkillFormRequest;
use App\Question;
use App\Repositories\Contracts\SkillRepositoryInterface;
use App\Skill;
use Illuminate\Http\Request;
use Validator;
use App\Course;
use App\Http\Controllers\Controller;

class SkillController extends Controller
{
    protected $repository;

    public function __construct(SkillRepositoryInterface $repository)
    {
        $this->middleware(['jwt.auth', 'checkAdm']);
        $this->repository = $repository;
    }


    public function index(Request $request)
    {
        $courses = $this->repository
            ->getAll('description',
                $request->name, $request->totalPage)
            ->orderBy('description', 'ASC')
            ->paginate($request->totalPage);

        return response()->json($courses, 200);
    }

    public function store(StoreUpdateSkillFormRequest $request)
    {
        $return = $this->repository->store([
            'description'  => $request->description,
            'fk_course_id'   => $request->fk_course_id,
        ]);

        return response()->json([
            'message' => 'Competência: '.$return->description.', cadastrada.',
            $return
        ], 200);
    }

    public function show(int $id)
    {
        $return = $this->repository
            ->findById($id);

        if($return->message){
            return response()->json([
                'message' => $return->message
            ], $return->status_code);
        }

        return response()->json($return, 200);
    }

    public function update(StoreUpdateSkillFormRequest $request, $id)
    {
        $return = $this->repository
            ->update($id, [
                'description'  => $request->description,
                'fk_course_id'   => $request->fk_course_id,
            ]);

        if($return->message){
            return response()->json([
                'message' => $return->message
            ], $return->status_code);
        }

        return response()->json([
            'message' => 'Competência: '.$return->description.', atualizada.',
            $return
        ], 200);

    }

    public function destroy($id)
    {
        $return =
            $this->repository->delete($id);

        if($return->message){
            return response()->json([
                'message' => $return->message
            ], $return->status_code);
        }

        return response()->json([
            'message' => 'Competência: '.$return->description.', excluída.',
            $return
        ], 200);
    }

}
