<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reporte extends Model
{
    use HasFactory;

    protected $table = 'reportes';

    protected $fillable = [
        'titulo',
        'descripcion',
        'fecha',
        'autor'
    ];

    const CREATED_AT = 'creado_en';
    const UPDATED_AT = 'actualizado_en';
}
