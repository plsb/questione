<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableRegulation extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('regulation', function (Blueprint $table) {
            $table->increments('id');
            $table->string('description', 200);
            $table->integer('year')->unsigned();

            $table->integer('fk_course_id')->unsigned();
            $table->foreign('fk_course_id')->references('id')->on('courses');
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
        Schema::dropIfExists('table_regulation');
    }
}
