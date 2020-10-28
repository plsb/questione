ProfessorvalidaQuestao<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProfessorvalidaQuestaosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('professor_valida_questao', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('fk_usuario_id')->unsigned();
            $table->integer('fk_questao_id')->unsigned();
            $table->boolean('aceita')->nullable();
            $table->boolean('rejeitada')->nullable();
            $table->boolean('modificacao_solicitada')->nullable();
            $table->foreign('fk_usuario_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('fk_questao_id')->references('id')->on('questions')->onDelete('cascade');
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
        Schema::dropIfExists('professorvalida_questaos');
    }
}
