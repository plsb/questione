<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyTableAnswerHeadAddFkApplication extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('answers_head', function (Blueprint $table) {
            $table->integer('fk_application_evaluation_id')->unsigned();
            $table->foreign('fk_application_evaluation_id')->references('id')->on('evaluation_application');
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
