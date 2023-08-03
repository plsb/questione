<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableRppoints extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table_rppoints', function (Blueprint $table) {
            $table->increments('id');
            $table->string('description_id', 50);
            $table->char('type', 1);
            $table->integer('point');
            $table->integer('fk_class_id')->unsigned()->nullable();
            $table->foreign('fk_class_id')->references('id')->on('class');
            $table->integer('fk_answers_head_id')->unsigned()->nullable();
            $table->foreign('fk_answers_head_id')->references('id')->on('answers_head');
            $table->integer('fk_answers_id')->unsigned()->nullable();
            $table->foreign('fk_answers_id')->references('id')->on('answers');
            $table->integer('fk_user_id')->unsigned();
            $table->foreign('fk_user_id')->references('id')->on('users');
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
        Schema::dropIfExists('table_rppoints');
    }
}
