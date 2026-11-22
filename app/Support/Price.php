<?php

namespace App\Support;

use Illuminate\Http\Request;

class Price
{
    public const RULE = 'nullable|numeric|decimal:0,2|min:0|max:999999.99';

    /**
     * Prices are typed the French way ("34,99"): accept the comma as decimal separator.
     */
    public static function normalize(Request $request, array $fields = ['price']): void
    {
        foreach ($fields as $field) {
            if (is_string($request->input($field))) {
                $request->merge([$field => str_replace(',', '.', trim($request->input($field)))]);
            }
        }
    }
}
