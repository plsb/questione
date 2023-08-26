<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyTableKnowledgeObjectsAddRegulation extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('knowledge_objects', function (Blueprint $table) {
            $table->integer('fk_regulation_id')->unsigned()->nullable();
            $table->foreign('fk_regulation_id')->references('id')->on('regulation');
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
