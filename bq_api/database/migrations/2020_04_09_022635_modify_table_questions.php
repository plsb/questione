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
            $table->renameColumn('fk_perfil_id', 'fk_profile_id');
            $table->renameColumn('fk_competencia_id', 'fk_skill_id');
            $table->renameColumn('fk_usuario_id', 'fk_user_id');
            $table->renameColumn('referencia', 'reference');
            $table->renameColumn('fk_curso_id', 'fk_course_id');
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
