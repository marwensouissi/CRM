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
        User::firstOrCreate(
            ['email' => 'admin@flowcrm.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
                'role' => 'ADMIN',
                'title' => 'System Administrator'
            ]
        );

        // 2. Create Team Members (Managers & Representatives)
        $users = User::factory()->count(10)->create()->each(function ($u) {
            $u->update([
                'role' => fake()->randomElement(['MANAGER', 'USER']),
                'title' => fake()->randomElement(['Sales Representative', 'Account Manager', 'Support Specialist'])
            ]);
        });

        // 3. Create Clients
        $clients = Client::factory()->count(15)->create();

        // 4. Create Leads
        Lead::factory()->count(20)->create();

        // 5. Distribute Work to Team Members
        foreach ($users as $user) {
            // Assign Deals
            Deal::factory()->count(rand(2, 5))->create([
                'assigned_to' => $user->id,
                'client_id' => $clients->random()->id
            ]);

            // Assign Tickets
            \App\Models\Ticket::factory()->count(rand(1, 4))->create([
                'assigned_to' => $user->id,
                'client_id' => $clients->random()->id
            ]);

            // Assign Tasks
            \App\Models\Task::factory()->count(rand(3, 8))->create([
                'assigned_to' => $user->id
            ]);
        }

        // 6. Create some unassigned items
        \App\Models\Task::factory()->count(5)->create(['assigned_to' => null]);
    }
}
