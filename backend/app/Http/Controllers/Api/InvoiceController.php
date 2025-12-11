<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index()
    {
        return Invoice::with('client')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_number' => 'required|unique:invoices',
            'client_id' => 'required|exists:clients,id',
            'amount' => 'required|numeric',
            'issue_date' => 'required|date'
        ]);

        $invoice = Invoice::create($validated);
        return response()->json($invoice, 201);
    }

    public function show(Invoice $invoice)
    {
        return $invoice->load('client');
    }

    public function update(Request $request, Invoice $invoice)
    {
        $invoice->update($request->all());
        return response()->json($invoice);
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return response()->json(null, 204);
    }
}
