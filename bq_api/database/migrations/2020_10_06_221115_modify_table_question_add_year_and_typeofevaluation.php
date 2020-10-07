<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyTableQuestionAddYearAndTypeofevaluation extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->integer('year')->nullable();

            $table->integer('fk_type_of_evaluation_id')->unsigned()->nullable();
            $table->foreign('fk_type_of_evaluation_id')->references('id')->on('type_of_evaluations');
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
