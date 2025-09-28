# My-App (Expo Router / TMDB)

App de React Native con Expo Router que muestra una sola película de TMDB según un ID. Ingresas el ID en el Home, ves la película en la pantalla Películas y, al tocar el póster, navegas al Detalle de esa misma película.

## Características
- Home con buscador de ID de película (único lugar con input).
- Pantalla Películas: muestra solo la película del ID recibido por params.
- Tap en la imagen → navega al detalle dinámico `/detalle/[id]`.
- Navegación con `expo-router` usando un único contenedor (sin contenedores anidados).
- Componentes reutilizables en `components/` (Loading, ErrorView, MovieCard).

## Requisitos
- Node.js LTS (recomendado 18+)
- npm 9+ o pnpm/yarn
- Entorno RN para Expo:
  - Android Studio (emulador) o dispositivo Android con Expo Go
  - Xcode (simulador) o dispositivo iOS con Expo Go (en macOS)

## Configuración de entorno
1) Crea un archivo `.env` en la raíz con tu token Bearer (v4) de TMDB:

```
EXPO_PUBLIC_TMDB_API_KEY=TU_TOKEN_BEARER_DE_TMDB
```

- Debe ser el token Bearer (v4), no la API key v3.
- Variables que comienzan con `EXPO_PUBLIC_` quedan disponibles en `process.env` dentro del bundle de Expo.

2) ¿Cómo obtener el token Bearer?
- https://www.themoviedb.org/settings/api → “API Read Access Token (v4 auth)”.

## Instalación
```
npm install
```

## Ejecutar en desarrollo
```
npm start
```
Luego, en la terminal de Expo:
- `a` Android, `i` iOS (macOS), `w` Web.

## Rutas principales
- `/` (Home): input para el ID y botones de navegación.
- `/peliculas`: muestra solo la película del ID pasado por query (`/peliculas?id=122`).
- `/detalle/[id]`: detalle dinámico de la película, por ejemplo `/detalle/122`.

## Flujo de uso
1) En Home, ingresa un ID de película (ej: 122).
2) “Ver Película” → abre `/peliculas?id=<ID>` y carga esa película.
3) Toca la imagen → navega a `/detalle/<ID>`.
4) “Ver Detalle” desde Home salta directo al detalle.

## Archivos relevantes
- `app/index.js`: Home con input de ID y navegación.
- `app/peliculas.js`: obtiene y muestra una sola película por ID; tap para ir a detalle.
- `app/detalle/[id].js`: detalle usando `useLocalSearchParams`.
- `app/_layout.js`: define la navegación (`Stack`) de Expo Router.
- `components/Loading.jsx`: indicador de carga reutilizable.
- `components/ErrorView.jsx`: vista simple para errores.
- `components/MovieCard.jsx`: tarjeta de película (póster + texto + onPress).

## Notas
- Si ves un aviso sobre `Linking` y `scheme` en build, agrega un `scheme` en `app.json` o `app.config.js` para producción (en desarrollo no hace falta).
- Si el token falta o es inválido, TMDB responde 401/403. Verifica `.env` y reinicia el bundler si cambias la variable.
- La app usa Expo Router como único contenedor de navegación (sin NavigationContainer anidados).

## Scripts
- `npm start` Inicia el servidor de desarrollo (Expo)
- `npm run android` Abre en Android (si es posible)
- `npm run ios` Abre en iOS (macOS)
- `npm run web` Abre versión web

## Estructura
```
app/
  _layout.js
  index.js
  peliculas.js
  detalle/
    [id].js
components/
  Loading.jsx
  ErrorView.jsx
  MovieCard.jsx
.env
package.json
```

