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
    Schema::create('reportes', function (Blueprint $table) {
        $table->id();
    $table->string('titulo', 50);
    $table->string('descripcion', 50);
        $table->date('fecha');
        $table->string('autor');
    $table->date('created_at')->default(DB::raw('CURRENT_DATE'));
    $table->date('updated_at')->default(DB::raw('CURRENT_DATE'));
    });
}


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reportes');
    }
};
