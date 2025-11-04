# PELISAPI+ (Expo Router / TMDB)

App de React Native con Expo Router que muestra una sola película de TMDB según un ID. Ingresas el ID en el Home, ves la película en la pantalla Películas y, al tocar el póster, navegas al Detalle de esa misma película.

# App móvil (Expo, TMDB, SQLite)

Proyecto finalizado: aplicación Expo/React Native que consume la API de TMDB para mostrar datos de películas y mantiene una biblioteca local persistente con SQLite para realizar un CRUD completo. Además incluye un sistema de opiniones personales (puntaje 0–100, reseña y fecha).

Resumen rápido
- Frontend: Expo + React Native + Expo Router.
- Persistencia: SQLite local a través de `expo-sqlite`.
- API externa: The Movie Database (TMDB) — se usa el token Bearer (v4) en `EXPO_PUBLIC_TMDB_API_KEY`.

Funcionalidades principales
- CRUD sobre la biblioteca local (`movies`): crear, listar, editar, eliminar.
- Opiniones personales: cada registro puede contener `userRating` (0–100), `review` (texto) y `reviewDate` (fecha).
- Guardar desde TMDB: guardar/actualizar películas usando datos desde TMDB (función `upsertFromTmdb`).
- Formulario rápido de opinión en la pantalla `Peliculas` (slider + reseña).
- Formularios completos para crear/editar películas en `Mi biblioteca` con campos de reseña y fecha (estilo distintivo).
- Mensajes y confirmaciones con modal estilizado de la app (`components/AppModal.jsx`).

Instalación y requisitos
- Node.js (16+ recomendado) y npm / yarn / pnpm.
- Expo CLI (opcional, se puede usar `npx expo`).

Instalar dependencias:

```powershell
npm install
npm install @react-native-community/slider
```

Configurar la API Key de TMDB
1. Crea un archivo `.env` en la raíz del proyecto con:

```env
EXPO_PUBLIC_TMDB_API_KEY=TU_TOKEN_BEARER_DE_TMDB
```

2. Reinicia el bundler si haces cambios en `.env`.

Arrancar en desarrollo

```powershell
npx expo start
# o con caché limpia
npx expo start -c
```

Rutas y pantallas (resumen)
- `/` (Home): buscador por ID y accesos.
- `/peliculas`: muestra una película por ID; incluye botón "Deja tu opinión" que abre el formulario rápido.
- `/detalle/[id]`: vista de detalle SOLO con información pública (sin acciones de guardado).
- `/biblioteca`: lista de películas guardadas (Read).
- `/biblioteca/nuevo`: formulario para crear un registro manual (Create) — incluye campos de opinión.
- `/biblioteca/[id]`: editar registro (Update) — incluye edición de reseña/puntaje/fecha; eliminar con confirmación (Delete).

Archivos y componentes clave
- `db/movies.js`: todas las operaciones SQLite (init, fetch, create, update, delete, upsertFromTmdb, saveReview, resetMovies).
- `hooks/useMovies.js`: hook que centraliza llamadas a la DB y controla estado (movies, loading, error) y acciones (create, update, remove, saveFromTmdb, saveReview).
- `components/MovieForm.jsx`: formulario completo para crear/editar películas (ahora con campos `userRating`, `review`, `reviewDate`).
- `components/MovieReviewForm.jsx`: formulario rápido (slider 0–100 + reseña) usado en `/peliculas`.
- `components/LibraryItem.jsx`: tarjeta de la lista que muestra título, poster y — si existe — `userRating` y un fragmento de la `review`.
- `components/AppModal.jsx`: modal reutilizable para mensajes y confirmaciones (reemplaza Alert).

Cómo el proyecto cubre la consigna (CRUD + SQLite)
- Uso de SQLite: `db/movies.js` crea y normaliza la tabla `movies` y expone funciones para CRUD.
- Create: `app/biblioteca/nuevo.js` (formulario manual) y `upsertFromTmdb` (guardar desde TMDB).
- Read: `app/biblioteca/index.js` lista los registros guardados.
- Update: `app/biblioteca/[id].js` permite editar todos los campos, incluidas las opiniones.
- Delete: eliminación con confirmación modal disponible desde la lista y desde la pantalla de edición.
- Persistencia: la DB local mantiene los registros entre reinicios de la app.

Pruebas rápidas (checklist)
1. `npx expo start -c`.
2. Home → ingresar ID (ej: `122`) → Ver Película (`/peliculas?id=122`).
3. Pulsar "Deja tu opinión" → completar slider + reseña → Guardar.
4. Ver `Mi biblioteca`: confirmar que aparece la película con "Tu puntuación: X/100" y snippet de reseña.
5. Editar un registro y modificar `userRating`, `review`, `reviewDate`.
6. Crear un registro manual con reseña/puntaje/fecha.
7. Reiniciar la app y verificar persistencia.

---
