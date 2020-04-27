<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyTableUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('nome', 'name');
            $table->renameColumn('senha', 'password');
            $table->renameColumn('nivel_acesso', 'acess_level');
            $table->timestamp('email_verified_at')->nullable();
            $table->dropColumn(['pode_inserir_questao']);
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
