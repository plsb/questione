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
        Schema::create('professor_curso', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('fk_usuario_id')->unsigned();
            $table->integer('fk_curso_id')->unsigned();
            $table->string('comprovante');
            $table->boolean('validado');

            $table->foreign('fk_usuario_id')->references('id')->on('usuarios')->onDelete('cascade');
            $table->foreign('fk_curso_id')->references('id')->on('cursos')->onDelete('cascade');
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
