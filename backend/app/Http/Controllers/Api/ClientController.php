<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        return Client::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:clients',
            'status' => 'required',
            'phone' => 'nullable|string',
            'industry' => 'nullable|string',
            'address' => 'nullable|string',
            'total_spent' => 'nullable|numeric',
            'avatar' => 'nullable|string'
        ]);

        $client = Client::create($validated);
        return response()->json($client, 201);
    }

    public function show(Client $client)
    {
        return $client->load('deals');
    }

    public function update(Request $request, Client $client)
    {
        $client->update($request->all());
        return response()->json($client);
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return response()->json(null, 204);
    }
}
