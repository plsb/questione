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
            $table->renameColumn('fk_avaliacao_questao_id', 'fk_evaluation_question_id');
            $table->renameColumn('fk_aplicacao_avaliacao_id', 'fk_aplication_evaluation_id');
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
