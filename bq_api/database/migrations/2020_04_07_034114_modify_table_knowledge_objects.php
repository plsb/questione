<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyTableKnowledgeObjects extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('knowledge_objects', function (Blueprint $table) {
            $table->renameColumn('descricao', 'description');
            $table->dropForeign('knowledge_objects_fk_curso_id_foreign');
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
