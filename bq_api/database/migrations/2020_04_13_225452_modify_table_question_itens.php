<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyTableQuestionItens extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('question_itens', function (Blueprint $table) {
            $table->renameColumn('descricao', 'description');
            $table->renameColumn('item_correto', 'correct_item');
            $table->dropForeign('question_itens_fk_questao_id_foreign');
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
