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
            $table->renameColumn('fk_questao_id', 'fk_question_id');
            $table->renameColumn('fk_obj_conhecimento_id', 'fk_knowledge_object');
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
