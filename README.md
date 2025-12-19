## UniResource
Proyecto de Repositorio académico para la Facultad de Ciencias de la Universidad Nacional de ingeniería
### Estructura
La estructura del repo (código) sigue la estructura de repo monolítico de backend-frontend del framework Nx. 
- Frontend: SPA (React)
- 
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
- ``localhost:3000/api/auth/login``: Login (ver LoginDTO para saber que enviar)
- ``localhost:3000/api/auth/register``: Crear nuevo usuario (ver createUserDto para saber que enviar)
#### Usuario:
(Todos estos requieren enviar el token proporcionado en autenticación, habiéndose autenticado como **USER**)
- ``localhost:3000/api/user/visualize/(id:number)``: Retorna el recurso especificado en imágenes (Visualizar recurso)
- ``localhost:3000/api/user/download/(id:number)``: Descarga del recurso especificado (Descargar recurso)
- ``localhost:3000/api/user/search``: Búsqueda de recursos (ver searchResourceDTO para saber que enviar al server)
- ``localhost:3000/api/user/request``: Solicitar colaboración
- ``localhost:3000/api/user/rsrc_ref/(id:number)``: Retorna información (mas no el archivo, referencia a recurso) de un recurso (se usa junto con la búsqueda, ver el caso de uso)
#### Colaboración:
(Todos estos requieren enviar el token proporcionado en autenticación, habiéndose autenticado como rol **COLLAB**)
- `localhost:3000/api/collab/myRequests`
- `localhost:3000/api/collab/upload`
- `localhost:3000/api/collab/update/(id:number)`
- `localhost:3000/api/collab/delete/(id:number)`,
- `localhost:3000/api/collab/myResources`
#### Admin
(Todos estos requieren enviar el token proporcionado en autenticación, habiéndose autenticado como rol **ADMIN**)
(Por el momento solo están los relacionados a la aprobación de solicitudes, los cuales son los más importantes)
- `localhost:3000/api/admin/requests`: Obtiene todas las solicitudes existentes en la base de datos
- `localhost:3000/api/admin/approve/:id`: Aprueba la solicitud con id: id
- `localhost:3000/api/admin/deny/:id`: Deniega la solicitud con id: id

