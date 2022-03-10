<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableClassStudents extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('class_students', function (Blueprint $table) {
            $table->increments('id');
            $table->boolean('active')->default(1);
            $table->integer('fk_class_id')->unsigned();
            $table->integer('fk_user_id')->unsigned();
            $table->foreign('fk_class_id')->references('id')->on('class');
            $table->foreign('fk_user_id')->references('id')->on('users');
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
        Schema::dropIfExists('table_class_students');
    }
}
