## UniResource
Proyecto de Repositorio académico para la Facultad de Ciencias de la Universidad Nacional de ingeniería
### Estructura
La estructura del repo (código) sigue la estructura de repo monolítico de backend-frontend del framework Nx. 
- Frontend: SPA (React)
- Backend: NestJS Application
### Ejecución:
### Requisitos:
- Node.js 
- npm
- Nx
- Docker

### Ejecución:
Si es la primera vez que clona el repositorio, asegúrese de tener las dependencias instaladas:
```bash
npm i
```
Por defecto, `./storage` no tiene ningún archivo (subirlo a git sería imposible), así que no habrá ningún recurso en la base de datos.
Inicie el container de producción
```bash
docker compose -f docker-compose.yml up --build
```
Si no existe ningún error, ahora tendrá un contenedor con tres servicios: `app-database`, `app-backend`, `app-frontend`. Puede verificar su existencia a través de `docker ps`. \
De ocurrir algún error, puede usar `docker logs <container name>` para ver el error en cuestión \
Si ningún error ha ocurrido, el `frontend` estará en la dirección
```
localhost
```
Vaya a su navegador y escriba en la URL `localhost`. Nginx se encargará de enrutarlo y  la página de autenticación debe de mostrarse. \
Por defecto, el sistema viene con el superusuario `admin`:
```json
username: admin
email: admin@admin.com
password: admin
```
Puede crear nuevos usuarios y aceptar sus solicitudes de colaboración usando aquel superusuario. \
Actualmente, no existe forma de crear un nuevo administrador si no es con *queries* directas a la base de datos
