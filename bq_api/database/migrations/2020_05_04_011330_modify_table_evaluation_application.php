<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyTableEvaluationApplication extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('evaluation_application', function (Blueprint $table) {
            $table->string('id_application', 50);
            $table->string('description', 1000);
            $table->dropForeign('evaluation_application_fk_avaliacao_id_foreign');
            $table->renameColumn('fk_avaliacao_id', 'fk_evaluation_id');
            $table->foreign('fk_evaluation_id')->references('id')->on('evaluations');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

    }
}
