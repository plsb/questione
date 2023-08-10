<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableBadgesParameters extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('badges_parameters', function (Blueprint $table) {
            $table->increments('id');
            $table->string('description_id', 50);
            $table->integer('parameter')->unsigned();
            $table->integer('fk_class_id')->unsigned();
            $table->foreign('fk_class_id')->references('id')->on('class');
            $table->integer('fk_user_id')->unsigned();
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
        Schema::dropIfExists('table_badges_parameters');
    }
}
