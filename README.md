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

### Rutas API por el momento:
#### Módulos
#### Autenticación:
- localhost:3000/api/auth/login: Login
- localhost:3000/api/auth/register: Crear nuevo usuario
#### Usuario:
(Todos estos requieren enviar el token proporcionado en autenticación)
- localhost:3000/api/user/resource/(id:number): Retorna el recurso especificado en imágenes (Visualizar recurso)
- localhost:3000/api/user/download/(id:number): Descarga del recurso especificado (Descargar recurso)
- localhost:3000/api/user/search: Búsqueda de recursos
- localhost:3000/api/user/request: Solicitar colaboración
- localhost:3000/api/user/rsrc_ref/(id:number): Retorna información (mas no el archivo, referencia a recurso) de un recurso (se usa junto con la búsqueda, ver el caso de uso)


