<?php

namespace App\Repositories\Core\Eloquent;

use App\Course;
use App\Repositories\Contracts\CourseRepositoryInterface;
use App\Repositories\Core\BaseEloquentRepository;

class EloquentCourseRepository extends BaseEloquentRepository implements CourseRepositoryInterface
{
    public function entity()
    {
        return Course::class;
    }

}
