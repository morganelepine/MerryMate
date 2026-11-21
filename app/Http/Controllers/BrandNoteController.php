<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BrandNoteController extends Controller
{
    /**
     * Create, update or (when emptied) delete the auth user's note for a brand.
     */
    public function upsert(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'brand' => 'required|string|max:255',
            'content' => 'nullable|string|max:1000',
        ]);

        $notes = $request->user()->brandNotes();
        $content = trim($validated['content'] ?? '');

        if ($content === '') {
            $notes->where('brand', $validated['brand'])->delete();
        } else {
            $notes->updateOrCreate(
                ['brand' => $validated['brand']],
                ['content' => $content],
            );
        }

        return back();
    }
}
