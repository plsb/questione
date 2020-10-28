<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyTableQuestionsKnowledgeObjects extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('question_knowledge_objects', function (Blueprint $table) {
            $table->dropForeign('question_knowledge_objects_fk_questao_id_foreign');
            $table->renameColumn('fk_questao_id', 'fk_question_id');
            $table->foreign('fk_question_id')->references('id')->on('questions');
            $table->dropForeign('question_knowledge_objects_fk_obj_conhecimento_id_foreign');
            $table->renameColumn('fk_obj_conhecimento_id', 'fk_knowledge_object');
            $table->foreign('fk_knowledge_object')->references('id')->on('knowledge_objects');
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
