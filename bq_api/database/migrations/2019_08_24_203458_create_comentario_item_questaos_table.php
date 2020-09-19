<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateComentarioItemQuestaosTable extends Migration
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
            $table->text('comentario', 4000);
            $table->integer('fk_itens_questao_id')->unsigned()->nullable();
            $table->foreign('fk_itens_questao_id')
                ->references('id')->on('question_itens')->onDelete('cascade');
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
        Schema::dropIfExists('comentario_item_questaos');
    }
}
