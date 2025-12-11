<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index()
    {
        return Ticket::with(['client', 'assigned_to'])->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required',
            'client_id' => 'required|exists:clients,id',
            'status' => 'required'
        ]);

        $ticket = Ticket::create($validated);
        return response()->json($ticket, 201);
    }

    public function show(Ticket $ticket)
    {
        return $ticket->load(['client', 'assigned_to']);
    }

    public function update(Request $request, Ticket $ticket)
    {
        $ticket->update($request->all());
        return response()->json($ticket);
    }

    public function destroy(Ticket $ticket)
    {
        $ticket->delete();
        return response()->json(null, 204);
    }
}
