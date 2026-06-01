<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'openai' => [
        'key' => env('OPENAI_API_KEY'),
    ],

    'paypal' => [
            'mode' => env('PAYPAL_MODE', 'sandbox'), // 'sandbox' немесе 'live'

            // ✅ SANDBOX РЕЖИМІНЕ АРНАЛҒАН ДЕРЕКТЕР
            'sandbox' => [
                'client_id' => env('PAYPAL_SANDBOX_CLIENT_ID'),
                'secret' => env('PAYPAL_SANDBOX_SECRET'),
                // 'app_id' => '', // Қажет болса қосуға болады
            ],

            // ✅ LIVE РЕЖИМІНЕ АРНАЛҒАН ДЕРЕКТЕР
            'live' => [
                'client_id' => env('PAYPAL_LIVE_CLIENT_ID'),
                'secret' => env('PAYPAL_LIVE_CLIENT_SECRET'),
                // 'app_id' => '', // Қажет болса қосуға болады
            ],

            // ✅ Жалпы валюта, егер PaymentTourController-де қолданылса
            'currency' => env('PAYPAL_CURRENCY', 'USD'),
            // ✅ Айырбастау курсы, егер PaymentTourController-де қолданылса
            'exchange_rate_to_usd' => env('PAYPAL_EXCHANGE_RATE_TO_USD', 450),
        ],

];
