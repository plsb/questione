<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuestaosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->increments('id');
            $table->text('texto_base', 8000);
            $table->text('enunciado', 8000);
            $table->boolean('validada');
            $table->boolean('dificuldade');
            $table->integer('fk_perfil_id')->unsigned();
            $table->integer('fk_competencia_id')->unsigned();
            $table->integer('fk_usuario_id')->unsigned();

            $table->foreign('fk_perfil_id')->references('id')->on('profiles')->onDelete('cascade');
            $table->foreign('fk_competencia_id')->references('id')->on('skills')->onDelete('cascade');
            $table->foreign('fk_usuario_id')->references('id')->on('users')->onDelete('cascade');
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
        Schema::dropIfExists('questoes');
    }
}
