<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableClassGamificationSettings extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('class_gamification_settings', function (Blueprint $table) {
            $table->increments('id');
            $table->string('description_id', 50);
            $table->string('description', 50);
            $table->integer('XP');
            $table->integer('RP');
            $table->integer('fk_class_id')->unsigned();
            $table->foreign('fk_class_id')->references('id')->on('class');
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
        Schema::dropIfExists('table_class_gamification_settings');
    }
}
