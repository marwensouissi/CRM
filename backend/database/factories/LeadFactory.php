<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class LeadFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'company' => fake()->company(),
            'email' => fake()->safeEmail(),
            'status' => fake()->randomElement(['NEW', 'CONTACTED', 'QUALIFIED', 'LOST', 'WON']),
            'value' => fake()->randomFloat(2, 500, 10000),
            'source' => fake()->randomElement(['Website', 'LinkedIn', 'Referral'])
        ];
    }
}
