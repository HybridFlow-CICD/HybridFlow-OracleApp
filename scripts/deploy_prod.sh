#!/bin/bash
set -e

echo "🚀 Iniciando DEPLOY en PRODUCCIÓN..."

# ----------------------------------------------
# 1) BACKUP ORACLE (Windows Server)
# ----------------------------------------------
echo "📦 Instalando sshpass..."
sudo apt-get update -y
sudo apt-get install -y sshpass

DUMP_NAME="prod_$(date +%Y%m%d_%H%M%S)"
BACKUP_FOLDER="/var/backups/hybridflow/$DUMP_NAME"

sudo mkdir -p "$BACKUP_FOLDER"
sudo chown ubuntu:ubuntu "$BACKUP_FOLDER"

echo "🗄 Ejecutando EXPDP en Windows Server..."
sshpass -p "UTNGRUPO02**" ssh -o StrictHostKeyChecking=no Administrador@137.0.30.3 "
  cd 'C:/app/oracle/product/19c/dbhome_1/BIN'
  ./expdp.exe GRUPO02/\"Grupo02*\" DIRECTORY=DATA_PUMP_DIR DUMPFILE=$DUMP_NAME.dmp LOGFILE=$DUMP_NAME.log SCHEMAS=GRUPO02 COMPRESSION=ALL
"

echo "⬇ Descargando DUMP..."
sshpass -p "UTNGRUPO02**" scp -o StrictHostKeyChecking=no Administrador@137.0.30.3:"C:/app/oracle/admin/orcl/dpdump/$DUMP_NAME.dmp" "$BACKUP_FOLDER/"
sshpass -p "UTNGRUPO02**" scp -o StrictHostKeyChecking=no Administrador@137.0.30.3:"C:/app/oracle/admin/orcl/dpdump/$DUMP_NAME.log" "$BACKUP_FOLDER/"

echo "✔ Backup Oracle guardado en:"
echo "$BACKUP_FOLDER"

# ----------------------------------------------
# 2) DEPLOY LARAVEL + NODE (VMware)
# ----------------------------------------------
echo "📥 Obteniendo últimos cambios..."
cd /var/www/html/HybridFlow-OracleApp
git fetch origin main
git reset --hard origin/main
git pull origin main

echo "📁 Reparando permisos..."
cd backend
sudo chown -R ubuntu:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

echo "📦 Instalando backend..."
composer install --no-interaction --prefer-dist --optimize-autoloader

if ! composer show | grep -q "yajra/laravel-oci8"; then
    composer require yajra/laravel-oci8:"^9.5" --no-interaction
fi

echo "🧹 Limpiando cachés..."
php artisan config:clear
php artisan cache:clear
php artisan optimize:clear
php artisan config:cache

echo "🔌 Probando conexión Oracle..."
php artisan tinker --execute="DB::connection()->getPdo();" \
    && echo "✔ Oracle OK (PROD)" \
    || { echo "❌ Oracle FAIL en PRODUCCIÓN"; exit 1; }

if [ "$1" = "migrate" ]; then
    echo "🛠 Ejecutando migraciones en PRODUCCIÓN..."
    php artisan migrate --force
fi

echo "✔ DEPLOY COMPLETADO EN PRODUCCIÓN"
