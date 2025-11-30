### Requisitos:
- Node.js 
- npm
- Nx
- Docker

### Ejecución:
Testeo rápido del backend:
- `docker compose -f docker-compose-dev.yml up --build` para iniciar la base de datos dockerizada (puerto 5433)
- `nx serve backend`: inicia el servidor (localhost:3000)

Testeo del frontend
- `nx serve frontend`: inicia el frontend (por el momento es una página en blanco)

Docker production mode (aún no está del todo probado):
- `docker compose build`
- `docker compose run`

### Notas
- Falta desarrollar el frontend
- Si estan en Windows, usen nvm-windows para Node y npm
