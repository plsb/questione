<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemQuestaosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('question_itens', function (Blueprint $table) {
            $table->increments('id');
            $table->text('descricao', 8000);
            $table->boolean('item_correto');
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
        Schema::dropIfExists('itens_questao');
    }
}
