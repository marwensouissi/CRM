<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Models\Lead;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    /**
     * Get all notes for a lead
     */
    public function index(Lead $lead)
    {
        return $lead->notes()->with('user')->latest()->get();
    }

    /**
     * Store a new note for a lead
     */
    public function store(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'content' => 'required|string'
        ]);

        $note = $lead->notes()->create([
            'content' => $validated['content'],
            'user_id' => $request->user()->id
        ]);

        return response()->json($note->load('user'), 201);
    }

    /**
     * Delete a note
     */
    public function destroy(Note $note)
    {
        // Optional: Check if user owns the note
        // if ($note->user_id !== request()->user()->id) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }
        
        $note->delete();
        return response()->json(null, 204);
    }
}
