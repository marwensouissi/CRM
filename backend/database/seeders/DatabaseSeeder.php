<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Client;
use App\Models\Lead;
use App\Models\Deal;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@flowcrm.com',
            'password' => bcrypt('password'),
            'role' => 'ADMIN',
            'title' => 'System Administrator'
        ]);

        // 2. Create Clients
        $clients = Client::factory()->count(10)->create();

        // 3. Create Leads (some converted, some new)
        Lead::factory()->count(20)->create();

        // 4. Create Deals for Clients
        foreach ($clients as $client) {
            Deal::factory()->count(rand(1, 3))->create([
                'client_id' => $client->id
            ]);
        }
    }
}
