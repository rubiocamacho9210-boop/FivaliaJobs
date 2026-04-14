# FivaliaJobs - Feature Roadmap

## Estado de funcionalidades

### ✅ Completadas

#### Autenticación
- [x] **Registro de usuarios** - Alta con email, password, nombre, rol (Worker/Client) y fecha de nacimiento
- [x] **Validación de edad** - Verifica que el usuario sea mayor de 18 años
- [x] **Login** - Autenticación con email y contraseña
- [x] **Logout** - Cerrar sesión

#### Perfiles de usuario
- [x] **Configurar perfil** - Bio, categoría, ubicación, contacto
- [x] **Editar perfil** - Modificar datos del perfil
- [x] **Subir foto de perfil** - Desde cámara o galería
- [x] **Ver perfil público** - Ver perfil de otros usuarios
- [x] **Calificación con estrellas (1-5)** - Sistema de rating estilo Uber/Didi
- [x] **Contador de calificaciones** - Número de veces calificado
- [x] **Seguir/Dejar de seguir usuarios** - Botón follow en perfiles públicos
- [x] **Ver seguidores** - Lista de usuarios que te siguen
- [x] **Ver siguiendo** - Lista de usuarios que sigues

#### Publicaciones (Posts)
- [x] **Crear publicación** - Tipo (NEED/OFFER), título, descripción, categoría
- [x] **Feed principal** - Ver todas las publicaciones activas
- [x] **Mis publicaciones** - Lista de publicaciones del usuario
- [x] **Detalle de publicación** - Información completa del post
- [x] **Cerrar/reabrir publicación** - Marcar como cerrada o reabrir
- [x] **Editar publicación** - Modificar datos del post
- [x] **Eliminar publicación** - Borrar post
- [x] **Buscar publicaciones** - Búsqueda por título/descripción
- [x] **Filtrar por tipo** - NEED/OFFER/Todos
- [x] **Filtrar por ubicación** - Por ciudad/ubicación del usuario
- [x] **Guardar favoritos** - Guardar posts para ver después
- [x] **Compartir publicaciones** - Botón compartir en posts

#### Reseñas y Calificaciones
- [x] **Reseñas escritas** - Comentarios con estrellas (1-5)
- [x] **Sistema de reseñas** - Después de cerrar un post
- [x] **Ver reseñas de usuarios** - Lista de reseñas recibidas
- [x] **Actualizar rating** - Promedio de calificaciones actualizado

#### Sistema de Intereses
- [x] **Marcar interés** - "Me interesa" en publicaciones
- [x] **Mis intereses** - Lista de publicaciones donde mostraste interés

#### Internacionalización (i18n)
- [x] **Español** - Traducción completa
- [x] **Inglés** - Traducción completa (idioma por defecto)
- [x] **Francés** - Traducción completa
- [x] **Alemán** - Traducción completa
- [x] **Portugués** - Traducción completa
- [x] **Italiano** - Traducción completa
- [x] **Selector de idioma** - Cambiar idioma desde perfil

#### Tema (Dark Mode)
- [x] **Modo Claro** - Tema claro por defecto
- [x] **Modo Oscuro** - Tema oscuro con colores púrpura
- [x] **Modo Sistema** - Sigue la configuración del dispositivo
- [x] **Selector de tema** - Cambiar tema desde perfil
- [x] **Adaptación dinámica** - Todos los componentes respetan el tema

#### Notificaciones
- [x] **Sistema de notificaciones** - Polling cada 5 minutos
- [x] **Notificaciones de interés** - Cuando alguien se interesa en tu post
- [x] **Notificaciones de followers** - Cuando alguien te sigue
- [x] **Notificaciones de reseñas** - Cuando te dejan una reseña
- [x] **Pantalla de notificaciones** - Ver toda la actividad

#### Base de datos (Backend)
- [x] **Modelo User** - Con rating y ratingCount
- [x] **Modelo Profile** - Con photoUrl
- [x] **Modelo Post** - Publicaciones con tipo y estado
- [x] **Modelo Interest** - Relaciones de interés
- [x] **Modelo Favorite** - Guardar posts favoritos
- [x] **Modelo Follow** - Relaciones de seguimiento
- [x] **Modelo Review** - Reseñas con comentarios
- [x] **Modelo Report** - Reportes de usuarios/posts
- [x] **Endpoints de favoritos** - CRUD para favoritos
- [x] **Endpoints de follows** - Seguir/dejar de seguir usuarios
- [x] **Endpoints de reseñas** - Crear y ver reseñas
- [x] **Endpoints de reportes** - Reportar usuarios/posts
- [x] **Endpoint de notificaciones** - Actividad reciente del usuario
- [x] **Filtros en posts** - type, category, search, location
- [x] **CRUD de posts** - Editar y eliminar publicaciones

---

### 🔄 En desarrollo
*(Ninguna actualmente)*

---

### 📋 Para hacer

#### Mensajería/Chat
- [ ] Chat interno entre usuarios
- [ ] Historial de conversaciones

#### Monetización
- [ ] Suscripciones premium
- [ ] Cobro por publicación destacada
- [ ] Comisión por transacción

#### Visibilidad
- [ ] Ordenar por fecha/relevancia

---

## Seguridad OWASP Implementada

#### Backend
- [x] CORS configurado
- [x] Helmet para headers de seguridad
- [x] Tokens JWT seguros
- [x] Password hashing con bcrypt
- [x] Validación de inputs con class-validator
- [x] Manejo de errores genéricos (no exponen stack traces)
- [x] Sanitización de datos en emails
- [x] Verificación de email obligatoria

#### Frontend
- [x] Almacenamiento seguro de tokens (expo-secure-store)
- [x] Errores de API no exponen información del backend
- [x] Manejo de errores centralizado

---

## Historial de Commits

| Fecha | Commit | Descripción |
|-------|--------|-------------|
| 2026-04-14 | `xxx` | Seguridad OWASP: CORS, Helmet, secure storage, manejo de errores |
| 2026-04-14 | `dac2419` | Agregar campos rating y photoUrl a User y Profile |
| 2026-04-14 | `3c1d41a` | Agregar rating con estrellas y subida de fotos |
| 2026-04-14 | `af8c194` | Agregar subida rápida de foto desde Mi Perfil |
| 2026-04-14 | `5a47792` | Mostrar rating en PostCards del Feed |
| 2026-04-14 | `44dc503` | Rating para workers y clients (estilo Uber/Didi) |
| 2026-04-14 | `63295ae` | Agregar francés, alemán, portugués, italiano |
| 2026-04-14 | `b90e0a4` | Colores dinámicos en PostDetailScreen |
| 2026-04-14 | `7082b2b` | Traducir mensajes de error del API |
| 2026-04-14 | `805bd50` | Aplicar tema dinámico a todos los componentes |
| 2026-04-14 | `f8fcac4` | Agregar dark mode con light/dark/system |
| 2026-04-14 | `a8ff8e9` | Sistema i18n con soporte 6 idiomas |
| 2026-04-14 | `8889104` | Corregir error undefined user en ProfileHeader |
| 2026-04-14 | `c3adb9a` | Agregar birthDate al modelo User y registro |
| 2026-04-14 | `e90a59c` | Agregar campo birthDate y verificación de edad |
| 2026-04-14 | `c3adb9a` | Fix birthDate en backend y frontend |

---

## Notas técnicas

### Tecnologías utilizadas
- **Frontend**: React Native + Expo + TypeScript
- **Backend**: NestJS + Prisma + PostgreSQL
- **Estado**: Zustand (i18n, auth, theme)
- **UI**: Componentes custom con soporte dark mode
- **Query**: TanStack Query (React Query)

### Variables de entorno necesarias
```
# Backend
DATABASE_URL=postgresql://...
JWT_SECRET=...
EXPO_ACCESS_TOKEN=...

# Frontend
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Nuevas dependencias
- `expo-clipboard` - Para copiar enlaces al portapapeles

---

## Próximos pasos

1. **Implementar sistema de reseñas** - Permitir calificar con comentario escrito
2. **Desarrollar chat** - Mensajería en tiempo real entre usuarios
3. **Sistema de verificación** - Badges de usuario verificado

---

*Última actualización: 2026-04-14*
