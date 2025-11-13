<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

use Illuminate\Support\Facades\DB;

Route::get('/oracle-test', function () {
    try {
        DB::connection()->getPdo();
        return "Conectado a Oracle correctamente";
    } catch (\Exception $e) {
        return "Error de conexión Oracle: " . $e->getMessage();
    }
});

