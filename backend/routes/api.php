<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\DealController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\NoteController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('leads', LeadController::class);
    Route::post('leads/{lead}/status', [LeadController::class, 'updateStatus']); // Kanban move
    Route::get('leads/{lead}/notes', [NoteController::class, 'index']); // Get notes for a lead
    Route::post('leads/{lead}/notes', [NoteController::class, 'store']); // Add note to lead
    Route::delete('notes/{note}', [NoteController::class, 'destroy']); // Delete note

    Route::apiResource('clients', ClientController::class);
    Route::apiResource('deals', DealController::class);
    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('invoices', InvoiceController::class);
    Route::apiResource('tickets', TicketController::class);
    Route::apiResource('team', TeamController::class);

    Route::get('/stats', [StatsController::class, 'index']); // Dashboard stats
    Route::get('/activities', [StatsController::class, 'activities']); // Recent activities
});
