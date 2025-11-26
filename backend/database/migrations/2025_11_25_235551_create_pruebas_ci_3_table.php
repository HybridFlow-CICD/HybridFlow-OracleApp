<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    
public function up()
{
    Schema::create('pruebas_ci_3', function (Blueprint $table) {
        $table->id();
        $table->string('nombre')->nullable();
        $table->integer('valor')->nullable();
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('pruebas_ci_3');
}

};
