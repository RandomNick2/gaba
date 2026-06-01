<?php

return [
    /*
     * You can enable CORS for 1 or multiple paths.
     * Example: ['api/*', 'sanctum/csrf-cookie']
     */
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'register'], // ✅ Осы жерді өзгертіңіз!

    /*
     * The development server of Vite already handles CORS.
     * So, you can set the allowed_origins to nothing.
     */
    'allowed_origins' => array_filter(array_map('trim', explode(',', env(
        'CORS_ALLOWED_ORIGINS',
        'http://localhost:3002,http://127.0.0.1:3002'
    )))),

    'allowed_methods' => ['*'], // Барлық HTTP әдістеріне рұқсат

    'allowed_headers' => ['*'], // Барлық хедерлерге рұқсат

    'exposed_headers' => [],

    'max_age' => 86400,

    'supports_credentials' => true,
];
