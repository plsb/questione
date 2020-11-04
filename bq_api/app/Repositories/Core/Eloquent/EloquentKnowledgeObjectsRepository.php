<?php

namespace App\Repositories\Core\Eloquent;

use App\KnowledgeObject;
use App\Repositories\Contracts\KnowledgeObjectsRepositoryInterface;
use App\Repositories\Core\BaseEloquentRepository;

class EloquentKnowledgeObjectsRepository extends BaseEloquentRepository implements KnowledgeObjectsRepositoryInterface
{
    public function entity()
    {
        return KnowledgeObject::class;
    }

}
