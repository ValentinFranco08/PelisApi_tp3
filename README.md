# PELISAPI+

![PELISAPI+ Banner](https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1400&q=80)

Aplicación para buscar, explorar y gestionar tu propia biblioteca de películas usando la API de TMDB. Compatible con Expo Go (móvil) y modo web.

---

## ⚡ Acceso rápido

> **Administrador predeterminado**  
> `usuario: admin`  
> `contraseña: admin123`

---

## 🚀 Instalación

1. **Clona el repositorio**
   ```powershell
   git clone https://github.com/ValentinFranco08/PelisApiCrud.git
   cd PelisApiCrud
   ```
2. **Instala dependencias**
   ```powershell
   npm install
   ```
3. **Configura tu API Key de TMDB**  
   Edita `.env` y coloca tu clave en `EXPO_PUBLIC_TMDB_API_KEY`.

---

## ▶️ Ejecución

### Móvil (Expo Go)
```powershell
npx expo start
```
- Escaneá el QR con Expo Go o abrí un emulador.

### Web
```powershell
npx expo start --web
```
- Navegá a `http://localhost:19006`.

---

## 🎬 Características principales
- **Pantalla principal** estilo Netflix: hero, búsqueda por ID TMDB y accesos rápidos.
- **Biblioteca personal** con CRUD completo, reseñas y puntajes propios.
- **Panel de administración** solo para admins (gestión de usuarios).
- **Autenticación** con roles y redirección automática.
- **Persistencia local**: SQLite en móvil, AsyncStorage en web.
- **Diseño oscuro** y responsive.

---

## 📦 Requisitos
- Node.js ≥ 18
- Expo CLI (`npm install -g expo-cli`)
- Clave válida de TMDB

---

## 🗂️ Estructura del proyecto
```
app/
  index.js           # Home / hero
  login.js           # Login
  peliculas.js       # Ver película por ID y dejar opinión
  biblioteca/        # CRUD biblioteca personal
  admin/users/       # Panel de administración
components/          # UI reutilizable (forms, modals, cards)
db/                  # Persistencia (SQLite + AsyncStorage)
hooks/               # Lógica de estado y acceso a DB
utils/               # Estilos y helpers
```

---

## 🎨 Inspiración visual
- Estética tipo Netflix: fondo oscuro, tipografía bold, acentos rojos.
- Microinteracciones suaves y layout responsive.

---

## 👤 Autor
- Valentin Franco  
- [GitHub](https://github.com/ValentinFranco08)

---

## 📜 Licencia
MIT
