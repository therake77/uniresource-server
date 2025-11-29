### Requisitos:
- Node.js
- npm
- Nx
- Docker (aún en proceso)

### Ejecución:
Testeo rápido:
- `nx serve backend`: inicia el servidor
- `nx serve frontend`: inicia el frontend (por el momento es una página en blanco)

Nota: requiere que tengas una instancia de PostgresSQL local con usuario postgres, contraseña postgres

Docker production mode:
- `docker compose build`
- `docker compose run`
Nota importante: Cualquier servicio local de PostgreSQL usando el puerto 5432 debe ser detenido o causará un error
### Notas:
- La configuración del servicio `Docker.dev` aún está pendiente (modo testeo en Docker)