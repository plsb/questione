<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyTableRankQuestion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rank_questions', function (Blueprint $table) {
            $table->renameColumn('classificacao', 'rank');
            $table->renameColumn('fk_usuario_id', 'fk_user_id');
            $table->renameColumn('fk_questao_id', 'fk_question_id');
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
