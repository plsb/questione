<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyTableAnswers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('answers', function (Blueprint $table) {
            $table->renameColumn('resposta', 'answer');
            $table->dropForeign('answers_fk_avaliacao_questao_id_foreign');
            $table->renameColumn('fk_avaliacao_questao_id', 'fk_evaluation_question_id');
            $table->foreign('fk_evaluation_question_id')->references('id')->on('evaluation_questions');
            $table->dropForeign('answers_fk_aplicacao_avaliacao_id_foreign');
            $table->renameColumn('fk_aplicacao_avaliacao_id', 'fk_aplication_evaluation_id');
            $table->foreign('fk_aplication_evaluation_id')->references('id')->on('evaluation_application');
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
