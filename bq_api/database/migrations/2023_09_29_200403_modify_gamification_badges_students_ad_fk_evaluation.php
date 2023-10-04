<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyGamificationBadgesStudentsAdFkEvaluation extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('gamification_badges_students', function (Blueprint $table) {
            $table->integer('fk_evaluation_aplication_id')->unsigned()->nullable();
            $table->foreign('fk_evaluation_aplication_id')->references('id')->on('evaluation_application');
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
