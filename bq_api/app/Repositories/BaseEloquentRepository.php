<?php

namespace App\Repositories\Core;

use App\Repositories\Exceptions\NotEntityDefined;
use App\Repositories\Contracts\RepositoryInterface;
use App\User;

class BaseEloquentRepository implements RepositoryInterface
{
    protected $entity;
    protected $userActive;

    public function __construct()
    {
        $this->entity = $this->resolveEntity();
        $this->userActive = User::where('id', '=', auth()->user()->id)
            ->with('employee')
            ->first();
    }

    public function getAll($columnSearch = null, $valueSearch = null, $totalPage = 10)
    {
        if($columnSearch && $valueSearch){
            return $this->entity
                ->where($columnSearch, 'like', '%'.$valueSearch.'%')
                ->where('fk_company_id', '=', $this->userActive->employee->fk_company_id);
        } else {
            return $this->entity
                ->where('fk_company_id', '=', $this->userActive->employee->fk_company_id);
        }
    }

    public function findById($id)
    {
        $object = $this->entity->where('id', $id)->first();

        if(!$object){
            $aux = (object)[
                'message' => 'Objeto não encontrado.',
                'status_code' => 404,
            ];
            return $aux;
        }
        if($object->fk_company_id){
            if($this->userActive->employee->fk_company_id != $object->fk_company_id){
                $aux = (object)[
                    'message' => 'Recurso não autorizado.',
                    'status_code' => 401,
                ];
                return $aux;
            }
        }

        return $object;
    }

    public function store(array $data)
    {
        $data['fk_company_id'] = $this->userActive->employee->fk_company_id;

        return $this->entity->create($data);
    }

    public function update($id, array $data)
    {
        $this->entity = $this->findById($id);

        if($this->entity->message){
            return $this->entity;
        }

        $data['fk_company_id'] = $this->userActive->employee->fk_company_id;

        if($this->entity->update($data)){
            return $this->entity;
        } else {
            $aux = (object)[
                'message' => 'Erro ao atualizar.',
                'status_code' => 200,
            ];
            return $aux;
        }
    }

    public function delete($id)
    {
        $this->entity = $this->findById($id);

        if($this->entity->message){
            return $this->entity;
        }

        if($this->entity->delete()){
            return $this->entity;
        } else {
            $aux = (object)[
                'message' => 'Erro ao deletar.',
                'status_code' => 200,
            ];
            return $aux;
        }
    }

    public function findWhere($column, $valor)
    {
        return $this->entity
            ->where($column, $valor)
            ->get();
    }

    public function findWhereFirst($column, $valor)
    {
        return $this->entity
            ->where($column, $valor)
            ->first();
    }

    public function paginate($totalPage = 10)
    {
        $entity = $this->entity->paginate($totalPage);
        return $entity;
    }

    public function relationships(...$relationships)
    {
        $this->entity = $this->entity->with($relationships);

        return $this;
    }

    public function orderBy($column, $order = 'DESC')
    {
        $this->entity = $this->entity->orderBy($column, $order);

        return $this;
    }

    public function resolveEntity()
    {
        if (!method_exists($this, 'entity')) {
            throw new NotEntityDefined;
        }

        return app($this->entity());
    }
}
