<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHelpForStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('help_for_students', function (Blueprint $table) {
            $table->increments('id');
            $table->string('description_id', 50);

            $table->integer('fk_anwers_id')->unsigned()->nullable();
            $table->foreign('fk_anwers_id')->references('id')->on('answers');

            $table->integer('fk_answer_deleted_id')->unsigned()->nullable();
            $table->foreign('fk_answer_deleted_id')->references('id')->on('question_itens');
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
        Schema::dropIfExists('help_for_students');
    }
}
