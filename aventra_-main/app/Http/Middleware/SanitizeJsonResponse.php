<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SanitizeJsonResponse
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Keep non-text responses untouched.
        if (!method_exists($response, 'getContent') || !method_exists($response, 'headers')) {
            return $response;
        }

        $content = $response->getContent();
        if (!is_string($content) || $content === '') {
            return $response;
        }

        $normalizedContent = ltrim($content);

        // Some environments prepend JS-style comments before JSON payloads.
        if (str_starts_with($normalizedContent, '//')) {
            $normalizedContent = ltrim(substr($normalizedContent, 2));
            $response->setContent($normalizedContent);
        }

        // If payload is valid JSON, always expose JSON content type.
        if ($response instanceof JsonResponse || $this->isValidJson($normalizedContent)) {
            $response->headers->set('Content-Type', 'application/json; charset=UTF-8');
        }

        return $response;
    }

    private function isValidJson(string $value): bool
    {
        json_decode($value, true);

        return json_last_error() === JSON_ERROR_NONE;
    }
}
