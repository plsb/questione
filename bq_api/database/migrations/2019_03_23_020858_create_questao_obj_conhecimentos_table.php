<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuestaoObjConhecimentosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('question_knowledge_objects', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('fk_questao_id')->unsigned();
            $table->integer('fk_obj_conhecimento_id')->unsigned();
            $table->foreign('fk_questao_id')->references('id')->on('questoes')->onDelete('cascade');
            $table->foreign('fk_obj_conhecimento_id')->references('id')->on('objetos_conhecimento')->onDelete('cascade');
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
        Schema::dropIfExists('questao_obj_conhecimentos');
    }
}
