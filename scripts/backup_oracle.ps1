# Ruta del Oracle DataPump
$oracleBin = "C:\app\oracle\product\19c\dbhome_1\BIN"
$dumppath  = "C:\app\oracle\admin\orcl\dpdump"

# Nombre del dump con fecha
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$dumpName = "oracle_backup_$timestamp"

Write-Host "📦 Iniciando backup ORACLE con EXPDP..."

cd $oracleBin

# Ejecutar EXPDP
.\expdp.exe `
    GRUPO02/"Grupo02*" `
    DIRECTORY=DATA_PUMP_DIR `
    DUMPFILE="$dumpName.dmp" `
    LOGFILE="$dumpName.log" `
    SCHEMAS=GRUPO02 `
    COMPRESSION=ALL

Write-Host "✔ Backup generado:"
Write-Host "$dumppath\$dumpName.dmp"
Write-Host "$dumppath\$dumpName.log"
