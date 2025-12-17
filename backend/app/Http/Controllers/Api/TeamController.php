<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class TeamController extends Controller
{
    public function index()
    {
        // Return users with counts of their activities
        return User::withCount(['deals', 'tickets', 'tasks'])->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required',
            'role' => 'required'
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);
        return response()->json($user, 201);
    }

    public function show(User $team)
    {
        return $team->load(['deals', 'tickets', 'tasks']);
    }

    public function update(Request $request, User $team)
    {
        if ($request->has('password')) {
            $request->merge(['password' => Hash::make($request->password)]);
        }
        $team->update($request->all());
        return response()->json($team);
    }

    public function destroy(User $team)
    {
        $team->delete();
        return response()->json(null, 204);
    }
}
