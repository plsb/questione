<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyTableEvaluationQuestion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('evaluation_questions', function (Blueprint $table) {
            $table->dropForeign('evaluation_questions_fk_avaliacao_id_foreign');
            $table->renameColumn('fk_avaliacao_id', 'fk_evaluation_id');
            $table->foreign('fk_evaluation_id')->references('id')->on('evaluations');
            $table->dropForeign('evaluation_questions_fk_questao_id_foreign');
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
