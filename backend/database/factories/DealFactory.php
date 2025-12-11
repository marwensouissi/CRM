<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DealFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->bs() . ' Deal',
            'value' => fake()->randomFloat(2, 5000, 100000),
            'stage' => fake()->randomElement(['PROSPECTING', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']),
            'probability' => fake()->numberBetween(10, 90),
            'expected_close_date' => fake()->dateTimeBetween('now', '+3 months')
        ];
    }
}
