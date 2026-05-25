# Game Backlog API

API REST para la gestión de backlogs de videojuegos con sistema de priorización automática. Proyecto académico desarrollado para el curso de Desarrollo de Aplicaciones Web con IA.

## Descripción

Aplicacion backend que permite a los usuarios registrar sus videojuegos pendientes, calcular automaticamente una puntuacion de prioridad y gestionar su progreso de completado.

## Stack Tecnológico

- **Runtime:** Node.js
- **Framework:** Express.js
- **Base de datos:** SQLite
- **ORM:** Prisma
- **Autenticacion:** JWT (jsonwebtoken)
- **Seguridad:** bcryptjs para hash de contrasenas

## Estructura del Proyecto

```
.
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── gameController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── gameRoutes.js
│   ├── lib/
│   │   └── prisma.js
│   └── app.js
├── .env
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

## Instalacion y Uso

1. Clona el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd game-backlog-api
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno:

Copia el archivo `.env` y ajusta los valores si es necesario:

```env
DATABASE_URL="file:./dev.db"
PORT=3000
JWT_SECRET="mi_clave_secreta_para_el_curso_daw_2026"
```

4. Genera el cliente de Prisma y ejecuta las migraciones:

```bash
npx prisma migrate dev --name init
```

5. Inicia el servidor:

```bash
# Modo desarrollo
npm run dev

# Modo produccion
npm start
```

El servidor estara disponible en `http://localhost:3000`.

## Endpoints de la API

### Autenticacion

| Metodo | Endpoint                | Descripcion                     | Auth |
|--------|-------------------------|---------------------------------|------|
| POST   | `/api/auth/register`    | Registro de nuevo usuario       | No   |
| POST   | `/api/auth/login`       | Login y obtencion de token JWT  | No   |

| Header para rutas protegidas: `Authorization: Bearer <token>`

### Juegos

| Metodo | Endpoint                           | Descripcion                                  | Auth |
|--------|------------------------------------|----------------------------------------------|------|
| POST   | `/api/games`                       | Crear un nuevo juego                         | Si   |
| GET    | `/api/games`                       | Listar juegos (filtros y ordenacion)         | Si   |
| PUT    | `/api/games/:id`                   | Editar un juego                              | Si   |
| DELETE | `/api/games/:id`                   | Eliminar un juego                            | Si   |
| PATCH  | `/api/games/:id/complete`          | Marcar juego como completado                 | Si   |

#### Filtros y ordenacion (GET /api/games)

- `?name=<nombre>`: Filtrar por nombre (contiene).
- `?category=<categoria>`: Filtrar por categoria (contiene).
- `?tags=<tag1,tag2>`: Filtrar por etiquetas (separadas por comas).
- `?sortBy=metacriticScore&order=desc`: Ordenar por puntuacion o estado de completado.

## Scripts Disponibles

| Script              | Descripcion                                 |
|---------------------|---------------------------------------------|
| `npm start`         | Inicia el servidor en modo produccion       |
| `npm run dev`       | Inicia el servidor en modo desarrollo       |
| `npm run prisma:migrate` | Ejecuta migraciones de Prisma          |
| `npm run prisma:studio`| Abre Prisma Studio para gestionar datos   |

## Algoritmo de Priorizacion

La prioridad de cada juego se calcula al vuelo en el backend mediante la formula:

```
priority = metacriticScore / hours
```

Si las horas son `0`, la prioridad devuelve `null` para evitar division por cero.

## Estado del Proyecto

- **Sprint 1:** API basica para un unico usuario (completado).
- **Sprint 2:** Soporte multiusuario con autenticacion JWT (completado).

## Licencia

Este proyecto esta bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para mas detalles.
