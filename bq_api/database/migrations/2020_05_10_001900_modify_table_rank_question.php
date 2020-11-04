<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyTableRankQuestion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rank_question', function (Blueprint $table) {
            $table->renameColumn('classificacao', 'rank');
            $table->dropForeign('rank_question_fk_usuario_id_foreign');
            $table->renameColumn('fk_usuario_id', 'fk_user_id');
            $table->foreign('fk_user_id')->references('id')->on('users');
            $table->dropForeign('rank_question_fk_questao_id_foreign');
            $table->renameColumn('fk_questao_id', 'fk_question_id');
            $table->foreign('fk_question_id')->references('id')->on('questions');
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
