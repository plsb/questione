<?php

namespace App\Http\Controllers\Adm;

use App\Course;
use App\Http\Requests\StoreUpdateCourseFormRequest;
use App\Question;
use App\Repositories\Contracts\CourseRepositoryInterface;
use http\Env\Response;
use Illuminate\Http\Request;
use Validator;
use App\Http\Controllers\Controller;

class CourseController extends Controller
{
    protected $repository;

    public function __construct(CourseRepositoryInterface $repository)
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

    public function store(StoreUpdateCourseFormRequest $request)
    {
        $return = $this->repository->store([
            'initials'  => $request->initials,
            'description'   => $request->description,
        ]);

        return response()->json([
            'message' => 'Curso: '.$return->description.', cadastrado.',
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

    public function update(StoreUpdateCourseFormRequest $request, $id)
    {
        $return = $this->repository
            ->update($id, [
                'initials'  => $request->initials,
                'description'   => $request->description,
            ]);

        if($return->message){
            return response()->json([
                'message' => $return->message
            ], $return->status_code);
        }

        return response()->json([
            'message' => 'Curso: '.$return->description.', atualizado.',
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
            'message' => 'Curso: '.$return->description.', excluído.',
            $return
        ], 200);
    }
}
