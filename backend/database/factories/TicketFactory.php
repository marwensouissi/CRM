<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'subject' => $this->faker->sentence(5),
            'description' => $this->faker->paragraph(),
            'priority' => $this->faker->randomElement(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
            'status' => $this->faker->randomElement(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
            'client_id' => Client::factory(), // Will be overridden in seeder
        ];
    }
}
