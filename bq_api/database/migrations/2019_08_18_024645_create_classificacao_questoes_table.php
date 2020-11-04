<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClassificacaoQuestoesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rank_question', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('classificacao');
            $table->integer('fk_usuario_id')->unsigned();
            $table->integer('fk_questao_id')->unsigned();

            $table->foreign('fk_usuario_id')->
                        references('id')->on('users');
            $table->foreign('fk_questao_id')->
                        references('id')->on('questions');
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
        Schema::dropIfExists('rank_question');
    }
}
