# PELISAPI+ 

![PELISAPI+ Banner](https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1400&q=80)

Aplicación para buscar, explorar y gestionar tu propia biblioteca de películas usando la API de TMDB. Compatible con Expo Go (móvil) y modo web.

---

## 🚀 Instalación

1. **Clona el repositorio:**
   ```powershell
   git clone https://github.com/ValentinFranco08/PelisApiCrud.git
   cd PelisApiCrud
   ```
2. **Instala dependencias:**
   ```powershell
   npm install
   ```
3. **Configura tu API Key de TMDB:**
   - Edita el archivo `.env` y coloca tu clave en `EXPO_PUBLIC_TMDB_API_KEY`.

---

## ▶️ Ejecución

### Móvil (Expo Go)
```powershell
npx expo start
```
- Escanea el QR con Expo Go (Android/iOS) o usa los atajos para abrir en emulador.

### Web
```powershell
npx expo start --web
```
- Accede a `http://localhost:19006` (o el puerto que indique Expo).

---

## 🎬 Características principales

- **Pantalla principal:**
  - Buscador por ID de película TMDB
  - Botones para ver película, ver detalle y acceder a tu biblioteca
  - Fondo visual tipo Netflix
- **CRUD completo de películas:**
  - Agrega, edita y elimina películas en tu biblioteca personal
  - Opiniones personales: puntaje (0–100), reseña y fecha
- **Panel de administración (solo admin):**
  - Gestión de usuarios (crear, editar, eliminar)
- **Autenticación:**
  - Login y registro de usuarios
  - Redirección automática según rol
- **Persistencia local:**
  - SQLite en móvil, AsyncStorage en web
- **Modo oscuro y diseño responsive**

---

## 🛠️ Requisitos
- Node.js >= 18
- Expo CLI (`npm install -g expo-cli`)
- Clave TMDB válida

---

## 📚 Estructura del proyecto
```
app/
  index.js           # Pantalla principal 
  login.js           # Login de usuario
  peliculas.js       # Ver película por ID y dejar opinión
  biblioteca/        # CRUD de tu biblioteca
  admin/users/       # Panel de administración
components/          # UI reutilizable (cards, modals, forms)
db/                  # Persistencia (SQLite/AsyncStorage)
hooks/               # Lógica de estado y DB
utils/               # Estilos y helpers
```

---

## 💡 Inspiración visual
- Estilo visual inspirado en Netflix: fondo oscuro, cards, botones rojos, tipografía bold.
- Animaciones y transiciones suaves.

---

## 👤 Autor
- Valentin Franco
- [GitHub](https://github.com/ValentinFranco08)

---

## 📝 Licencia
MIT
