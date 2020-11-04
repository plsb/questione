<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateModificacaosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('modificacoes', function (Blueprint $table) {
            $table->increments('id');
            $table->string('descricao_modificacao', 5000);

            $table->integer('fk_questao_id')->unsigned();
            $table->foreign('fk_questao_id')->references('id')->on('questions')->onDelete('cascade');

            $table->integer('fk_usuario_id')->unsigned();
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
        Schema::dropIfExists('modificacaos');
    }
}
