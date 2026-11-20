<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'confirmed' => "Les mots de passe ne sont pas identiques.",
    'current_password' => 'Le mot de passe est incorrect.',
    'email' => 'Renseigne une adresse email valide.',

    'integer' => 'Ce champ doit contenir un nombre entier.',

    'max' => [
        'numeric' => 'Ce champ ne doit pas doit contenir plus de :max chiffres.',
        'string' => 'Ce champ ne doit pas contenir plus de :max caractères.',
    ],
    'max_digits' => 'Ce champ ne doit pas doit contenir plus de :max chiffres.',
    'min' => [
        'numeric' => 'Ce champ doit contenir au moins :min chiffres.',
        'string' => 'Ce champ doit contenir au moins :min caractères.',
    ],
    'min_digits' => 'Ce champ doit contenir au moins :min chiffres.',

    'password' => [
        'letters' => 'Le mot de passe doit contenir au moins une lettre.',
        'mixed' => 'Le mot de passe doit contenir au moins une lettre majuscule et une lettre minuscule.',
        'numbers' => 'Le mot de passe doit contenir au moins un chiffre.',
        'symbols' => 'Le mot de passe doit contenir au moins un caractère spécial.',
        'uncompromised' => 'Le mot de passe donné est apparu dans une fuite de données. Choisis un autre :attribute.',
    ],

    'required' => 'Ce champ est requis.',
    'required_without' => "Ce champ est requis lorsque le champ ':values' n'est pas complété.",

    'string' => 'Ce champ doit contenir une chaîne de caractères.',

    'unique' => 'Cet :attribute existe déjà.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [],

];
