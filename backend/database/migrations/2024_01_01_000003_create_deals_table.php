<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('deals', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->decimal('value', 12, 2);
            $table->string('currency')->default('USD');
            $table->string('stage')->default('PROSPECTING');
            $table->integer('probability')->default(0); // 0-100%
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->foreignId('assigned_to')->nullable()->constrained('users');
            $table->date('expected_close_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deals');
    }
};
