<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyTableCourseProfessor extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('course_professor', function (Blueprint $table) {
            // $table->renameColumn('fk_usuario_id', 'fk_user_id');
            // $table->renameColumn('fk_curso_id', 'fk_course_id');
            // $table->renameColumn('comprovante', 'receipt');
            // $table->renameColumn('validado', 'valid');
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
