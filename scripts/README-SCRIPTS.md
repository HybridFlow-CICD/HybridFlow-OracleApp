🚀 1. Scripts de Despliegue
📌 deploy_dev.sh
Script ejecutado en el servidor Desarrollo (Ubuntu – Proxmox).

Funciones principales:

Obtiene el último código desde la rama develop o ramas de trabajo (pablo-dev, luis-dev).

Instala dependencias del backend (Laravel).

Limpia y reconstruye cachés (config, view, route, cache).

Ejecuta pruebas de conexión hacia Oracle a través del túnel SSH con VMware.

Ejecuta migraciones en desarrollo si se requiere.

📌 deploy_prod.sh
Script ejecutado en el servidor Producción (Ubuntu – VMware) mediante un túnel SSH inverso.

Funciones principales:

Obtiene el código actualizado desde la rama main.

Instala dependencias optimizadas para producción.

Reconstruye cachés y optimiza la aplicación.

Valida conectividad real hacia Oracle desde producción.

Ejecuta migraciones solo si el pipeline lo permite.

Se integra con el proceso automático de backup Oracle previo al despliegue.




🗃️ 2. Scripts de Gestión de Base de Datos (Oracle)
📌 backup_oracle.ps1
Script en PowerShell, ejecutado dentro del servidor Windows Server con Oracle 19c.

Funciones principales:

Ejecuta expdp para generar un respaldo completo del esquema GRUPO02.

Genera los archivos:

*.dmp → Dump de exportación

*.log → Registro del proceso

Es utilizado automáticamente por GitHub Actions antes del despliegue a producción.

Permite mantener respaldos históricos organizados en el servidor VMware.

📌 restore_oracle.sql
Script utilizado para la restauración manual de un respaldo Oracle mediante impdp.

Funciones principales:

Permite importar un backup previo.

Se utiliza en casos de recuperación, pruebas o validación académica.

No forma parte del pipeline automático, pero queda disponible para tareas administrativas.




🔗 3. Integración con CI/CD (GitHub Actions)
Los scripts de esta carpeta se integran directamente con el pipeline del proyecto:

deploy_dev.sh → usado en el Job:
“Deploy to Development (Proxmox)”

deploy_prod.sh → usado en el Job:
“Deploy to Production (VMware via SSH Tunnel)”

backup_oracle.ps1 → ejecutado automáticamente antes del deploy a producción.

restore_oracle.sql → utilizado solo en procesos manuales.

Esta estructura permite un flujo de despliegue profesional que incluye:

Actualización automática del backend.

Validación de Oracle desde CLI y vía web.

Backups automáticos antes de cada deploy.

Capacidad de rollback si es necesario.




🧩 4. Beneficios del sistema de scripts
Automatización completa de despliegues en dos entornos reales.

Respaldo automático previo al despliegue productivo.

Reducción del riesgo de pérdidas de datos.

Integración Linux + Windows + Oracle desde GitHub Actions.

Cumple con estándares reales de DevOps.




🏁 5. Estado final
Estos scripts están probados, integrados al CI/CD y forman parte del entregable técnico del proyecto.
Permiten demostrar un flujo profesional de despliegue, backup y validación de base de datos Oracle.




PRUEBA DE SCRIPTS