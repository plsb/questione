<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyTableEvaluation extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('evaluations', function (Blueprint $table) {
            $table->renameColumn('descricao', 'description');
            $table->renameColumn('codigo_avaliacao', 'id_evaluation');
            $table->renameColumn('fk_usuario_id', 'fk_user_id');
            $table->renameColumn('pode_ve_feedback', 'students_can_see_fedback');
            $table->renameColumn('pode_ve_comentarios_itens', 'studentes_can_see_comments_items');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
