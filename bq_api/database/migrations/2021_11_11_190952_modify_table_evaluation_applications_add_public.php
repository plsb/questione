<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyTableEvaluationApplicationsAddPublic extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('evaluation_application', function (Blueprint $table) {
            $table->boolean('public_results')->default(0);
            $table->boolean('can_see_students')->default(0); //se não for o dono da avaliação só poderáv ê o nome dos alunos se essa opção estiver habilitada
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
