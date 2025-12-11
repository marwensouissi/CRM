<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'email' => fake()->unique()->companyEmail(),
            'phone' => fake()->phoneNumber(),
            'industry' => fake()->word(),
            'status' => fake()->randomElement(['ACTIVE', 'INACTIVE']),
            'total_spent' => fake()->randomFloat(2, 1000, 50000)
        ];
    }
}
