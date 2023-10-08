<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLogStudentAssessmentLogTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('log_student_assessment', function (Blueprint $table) {
            $table->increments('id');
            $table->char('type', 1);

            $table->integer('fk_anwers_head_id')->unsigned()->nullable();
            $table->foreign('fk_anwers_head_id')->references('id')->on('answers_head');

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
        Schema::dropIfExists('log_student_assessment_log');
    }
}
