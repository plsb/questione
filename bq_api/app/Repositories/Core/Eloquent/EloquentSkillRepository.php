<?php

namespace App\Repositories\Core\Eloquent;

use App\Repositories\Contracts\SkillRepositoryInterface;
use App\Repositories\Core\BaseEloquentRepository;
use App\Skill;

class EloquentSkillRepository extends BaseEloquentRepository implements SkillRepositoryInterface
{
    public function entity()
    {
        return Skill::class;
    }

}
