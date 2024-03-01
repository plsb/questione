<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEloScoresStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('elo_scores_students', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('fk_user_id')->unsigned()->nullable();
            $table->foreign('fk_user_id')->references('id')->on('users');

            $table->integer('fk_knowledge_objects_id')->unsigned()->nullable();
            $table->foreign('fk_knowledge_objects_id')->references('id')->on('knowledge_objects');

            $table->float('elo', 0)->nullable();
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
        Schema::dropIfExists('elo_scores_students');
    }
}
