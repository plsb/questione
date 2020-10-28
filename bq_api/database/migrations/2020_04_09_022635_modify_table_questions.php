<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyTableQuestions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->renameColumn('texto_base', 'base_text');
            $table->renameColumn('enunciado', 'stem');
            $table->renameColumn('validada', 'validated');
            $table->dropForeign('questions_fk_perfil_id_foreign');
            $table->renameColumn('fk_perfil_id', 'fk_profile_id');
            $table->foreign('fk_profile_id')->references('id')->on('profiles');
            $table->dropForeign('questions_fk_competencia_id_foreign');
            $table->renameColumn('fk_competencia_id', 'fk_skill_id');
            $table->foreign('fk_skill_id')->references('id')->on('skills');
            $table->dropForeign('questions_fk_usuario_id_foreign');
            $table->renameColumn('fk_usuario_id', 'fk_user_id');
            $table->foreign('fk_user_id')->references('id')->on('users');
            $table->renameColumn('referencia', 'reference');
            $table->dropForeign('questions_fk_curso_id_foreign');
            $table->renameColumn('fk_curso_id', 'fk_course_id');
            $table->foreign('fk_course_id')->references('id')->on('courses');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
