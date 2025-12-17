<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;
use App\Enums\LeadStatus;
use Illuminate\Validation\Rules\Enum;

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

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => ['required', new Enum(LeadStatus::class)]
        ]);
        
        // Handle both model binding and direct ID
        $lead = ($id instanceof \App\Models\Lead) ? $id : \App\Models\Lead::findOrFail($id);
        
        $lead->status = $request->input('status');
        $lead->save();
        
        \App\Events\DashboardStatsUpdated::dispatch();
        return response()->json($lead);
    }
}
