<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAplicacaoAvaliacaosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('aplicacao_avaliacao', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('fk_avaliacao_id')->unsigned();
            $table->foreign('fk_avaliacao_id')->references('id')->on('avaliacoes')->onDelete('cascade');
            $table->timestamps(); //CREATED_AT Irá ser usado como data de criação do dia referente À avaliação
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('aplicacao_avaliacao');
    }
}
