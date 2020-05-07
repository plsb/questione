<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EvaluationApplication extends Model
{
    protected $table = 'evaluation_application';
    protected $fillable = ['id', 'id_application', 'description','fk_evaluation_id', 'status'];
    protected $hidden = [];

    public function evaluation(){
        return $this->belongsTo(Evaluation::class, 'fk_evaluation_id');
    }
}
