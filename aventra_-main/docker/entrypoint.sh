#!/bin/sh
set -e

mkdir -p storage/app/public storage/framework/cache/data storage/framework/sessions storage/framework/views bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

if [ -z "$APP_KEY" ]; then
    echo "APP_KEY is not set. Generating a temporary key for this container."
    export APP_KEY="$(php artisan key:generate --show --no-interaction)"
fi

php artisan storage:link --force || true
php artisan config:clear
php artisan route:clear
php artisan view:clear

if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Waiting for database..."
    until php -r "new PDO('mysql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT'), getenv('DB_USERNAME'), getenv('DB_PASSWORD'));" >/dev/null 2>&1; do
        sleep 2
    done

    php artisan migrate --force
fi

exec "$@"
