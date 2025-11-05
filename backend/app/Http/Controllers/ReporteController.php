<?php

namespace App\Http\Controllers;

use App\Models\Reporte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;



class ReporteController extends Controller
{
      public function index()
    {
        return response()->json(Reporte::all());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titulo' => 'required|string|unique:reportes,titulo',
            'descripcion' => 'required|string',
            'fecha' => 'required|date',
            'autor' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errores' => $validator->errors()], 422);
        }

    $data = $request->all();
    $hoy = date('Y-m-d');
    $data['creado_en'] = $hoy;
    $data['actualizado_en'] = $hoy;
    $reporte = Reporte::create($data);
    return response()->json($reporte, 201);
    }

    public function update(Request $request, $id)
    {
        $reporte = Reporte::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'titulo' => 'required|string|unique:reportes,titulo,' . $id,
            'descripcion' => 'required|string',
            'fecha' => 'required|date',
            'autor' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errores' => $validator->errors()], 422);
        }

    $data = $request->all();
    $data['actualizado_en'] = date('Y-m-d');
    $reporte->update($data);
    return response()->json($reporte);
    }

    public function destroy($id)
    {
        $reporte = Reporte::findOrFail($id);
        $reporte->delete();

        return response()->json(['mensaje' => 'Reporte eliminado']);
    }
}
