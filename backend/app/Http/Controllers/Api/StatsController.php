<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\Deal;
use App\Models\Client;
use App\Models\Activity;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function index()
    {
        $totalLeads = Lead::count();
        $totalClients = Client::count();
        $totalRevenue = Deal::where('stage', 'CLOSED_WON')->sum('value');
        $wonDeals = Deal::where('stage', 'CLOSED_WON')->count();
        
        // Example structure matching frontend KPI
        return response()->json([
            'total_leads' => $totalLeads,
            'total_clients' => $totalClients,
            'total_revenue' => $totalRevenue,
            'conversion_rate' => $totalLeads > 0 ? ($wonDeals / $totalLeads) * 100 : 0
        ]);
    }

    public function activities()
    {
        return Activity::with('user')->latest()->take(10)->get();
    }
}
