<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Name shown next to a reserved/purchased idea (the user's name, "Anonyme"…).
     */
    protected function validatedUserName(Request $request): string
    {
        return $request->validate([
            'userName' => 'required|string|max:255',
        ])['userName'];
    }
}
