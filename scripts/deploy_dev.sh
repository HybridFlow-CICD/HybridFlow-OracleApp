#!/bin/bash
set -e

echo "🚀 Iniciando deploy en DESARROLLO (Proxmox)..."

cd /var/www/html/HybridFlow-OracleApp

echo "📥 Obteniendo últimos cambios..."
git fetch origin develop
git reset --hard origin/develop
git pull origin develop

echo "📁 Reparando permisos..."
cd backend
sudo chown -R ubuntu:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

echo "📦 Instalando dependencias..."
composer install --no-interaction --prefer-dist --optimize-autoloader

echo "🔎 Verificando OCI8 (Oracle Driver)..."
if ! composer show | grep -q "yajra/laravel-oci8"; then
    echo "📦 Instalando Yajra OCI8..."
    composer require yajra/laravel-oci8:"^9.5" --no-interaction
else
    echo "✔ OCI8 ya está instalado."
fi

echo "🧹 Limpiando cachés..."
php artisan config:clear
php artisan cache:clear
php artisan optimize:clear
php artisan config:cache

echo "🔌 Probando conexión Oracle desde CLI..."
php artisan tinker --execute="DB::connection()->getPdo();" \
    && echo "✔ Oracle OK (DEV)" \
    || { echo "❌ Oracle FAIL en desarrollo"; exit 1; }

echo "🛠 Ejecutando migraciones..."
php artisan migrate --force

echo "✔ DEPLOY COMPLETADO EN DESARROLLO"
