<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Lead;
use App\Models\Deal;
use App\Models\Client;

class DashboardStatsUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $stats;

    public function __construct()
    {
        // define stats payload
        $this->stats = [
            'total_leads' => Lead::count(),
            'total_clients' => Client::count(),
            'total_revenue' => Deal::where('stage', 'CLOSED_WON')->sum('value'),
            'won_deals' => Deal::where('stage', 'CLOSED_WON')->count()
        ];
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('dashboard'),
        ];
    }
}
