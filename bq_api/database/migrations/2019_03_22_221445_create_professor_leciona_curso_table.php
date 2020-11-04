<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProfessorLecionaCursoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('course_professor', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('fk_user_id')->unsigned();
            $table->integer('fk_course_id')->unsigned();
            $table->string('receipt');
            $table->boolean('valid');

            $table->foreign('fk_user_id')->references('id')->on('users');
            $table->foreign('fk_course_id')->references('id')->on('courses');
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
        Schema::dropIfExists('professor_curso');
    }
}
