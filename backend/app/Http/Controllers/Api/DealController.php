<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Deal;
use Illuminate\Http\Request;

class DealController extends Controller
{
    public function index()
    {
        return Deal::with('client')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required',
            'value' => 'required|numeric',
            'client_id' => 'required|exists:clients,id',
            'stage' => 'required'
        ]);

        $deal = Deal::create($validated);
        return response()->json($deal, 201);
    }

    public function show(Deal $deal)
    {
        return $deal->load('client');
    }

    public function update(Request $request, Deal $deal)
    {
        $deal->update($request->all());
        return response()->json($deal);
    }

    public function destroy(Deal $deal)
    {
        $deal->delete();
        return response()->json(null, 204);
    }
}
