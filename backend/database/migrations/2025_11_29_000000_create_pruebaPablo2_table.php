<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::create('pruebaPablo2', function (Blueprint $table) {
        $table->id();
        $table->string('titulo');
        $table->timestamp('creado_en')->useCurrent();
    });
}

public function down()
{
    Schema::dropIfExists('pruebas_deploy');
}
 
};
