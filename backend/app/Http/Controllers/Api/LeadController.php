<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function index()
    {
        return Lead::with('assignedUser')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'nullable|email',
            'status' => 'required',
            'value' => 'numeric',
            'company' => 'nullable'
        ]);

        $lead = Lead::create($validated);
        
        \App\Events\DashboardStatsUpdated::dispatch();
        
        return response()->json($lead, 201);
    }

    public function show(Lead $lead)
    {
        return $lead->load('assignedUser');
    }

    public function update(Request $request, Lead $lead)
    {
        $lead->update($request->all());
        \App\Events\DashboardStatsUpdated::dispatch();
        return response()->json($lead);
    }

    public function destroy(Lead $lead)
    {
        $lead->delete();
        return response()->json(null, 204);
    }

    // Custom method for Kanban drag-drop
    public function updateStatus(Request $request, Lead $lead)
    {
        $request->validate(['status' => 'required']);
        $lead->update(['status' => $request->status]);
        \App\Events\DashboardStatsUpdated::dispatch();
        return response()->json($lead);
    }
}
