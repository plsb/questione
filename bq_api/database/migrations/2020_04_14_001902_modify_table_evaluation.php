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
            $table->renameColumn('fk_usuario_id', 'fk_user_id');
            $table->dropColumn(['pode_ve_feedback']);
            $table->dropColumn(['pode_ve_comentarios_itens']);
            $table->dropColumn(['codigo_avaliacao']);
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
