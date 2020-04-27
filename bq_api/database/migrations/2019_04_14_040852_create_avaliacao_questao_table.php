<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAvaliacaoQuestaoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluation_questions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('fk_avaliacao_id')->unsigned();
            $table->foreign('fk_avaliacao_id')->references('id')->on('avaliacoes')->onDelete('cascade');
            $table->integer('fk_questao_id')->unsigned();
            $table->foreign('fk_questao_id')->references('id')->on('questoes')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('avaliacao_questao');
    }
}
