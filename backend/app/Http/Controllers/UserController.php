<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

    $user = new User();
    $user->name = $request->name;
    $user->email = $request->email;
    $user->password = $request->password;
    $hoy = date('Y-m-d');
    $user->created_at = $hoy;
    $user->updated_at = $hoy;
    $user->save();

    return response()->json(['mensaje' => 'Usuario creado'], 201);
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
        ]);

        $user = User::findOrFail($id);
        $user->name = $request->name;
        $user->email = $request->email;
        if ($request->filled('password')) {
            $user->password = $request->password;
        }
        $user->updated_at = date('Y-m-d');
        $user->save();

        return response()->json(['mensaje' => 'Usuario actualizado'], 200);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['mensaje' => 'Usuario eliminado'], 200);
    }
}
