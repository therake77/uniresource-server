### Requisitos:
- Node.js
- npm
- Nx
- Docker

### Ejecución:
Testeo rápido del backend:
- `docker compose -f docker-compose-dev.yml up --build` para iniciar la base de datos dockerizada
- `nx serve backend`: inicia el servidor (localhost:3000)

Testeo del frontend
- `nx serve frontend`: inicia el frontend (por el momento es una página en blanco)

Docker production mode:
- `docker compose build`
- `docker compose run`

### Notas:
- Nota importante: Cualquier servicio local de PostgreSQL usando el puerto 5432 debe ser detenido o causará un error
- La configuración del servicio `Docker.dev` aún está pendiente (modo testeo en Docker)