<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableKnowledgeObjectsRelated extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('knowledge_objects_related', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('fk_obj2_id')->unsigned()->nullable();
            $table->foreign('fk_obj2_id')->references('id')->on('knowledge_objects');

            $table->integer('fk_obj1_id')->unsigned()->nullable();
            $table->foreign('fk_obj1_id')->references('id')->on('knowledge_objects');
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
        Schema::dropIfExists('table_knowledge_objects_related');
    }
}
