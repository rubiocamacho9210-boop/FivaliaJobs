# QA Checklist - FivaliaJobs Mobile MVP

Fecha: 2026-04-14
Rama: `feature/mobile-integration-clean`

## A. Precondiciones

- [ ] Backend ejecutando en puerto `3000`
- [ ] Frontend `.env` configurado con IP LAN real
- [ ] Sesion de Expo iniciada (`npm start`)
- [ ] Pruebas en iOS y Android (simulador o dispositivo)

## B. Auth

- [ ] Registro exitoso (`POST /auth/register`)
- [ ] Login automatico posterior a registro (`POST /auth/login`)
- [ ] Redireccion a `ProfileSetup` despues de registro
- [ ] Login con cuenta existente funciona
- [ ] Error correcto para credenciales invalidas
- [ ] Token persiste al cerrar/reabrir app
- [ ] Logout limpia sesion local

## C. Perfil

- [ ] Guardar perfil inicial (`PATCH /profile`) desde setup
- [ ] Editar perfil desde "Mi perfil"
- [ ] Ver perfil propio (`GET /profile/me`)
- [ ] Ver perfil publico (`GET /profile/:id`)
- [ ] Estado vacio para usuario sin perfil

## D. Posts

- [ ] Feed carga posts (`GET /posts`)
- [ ] Pull to refresh funciona en feed
- [ ] Crear post (`POST /posts`) redirige a feed
- [ ] Ver detalle (`GET /posts/:id`)
- [ ] Ver publicaciones por usuario (`GET /posts/user/:userId`)

## E. Interests

- [ ] Boton "Me interesa" crea interes (`POST /interests`)
- [ ] Mensaje correcto si ya existe interes
- [ ] "Mis intereses" carga datos (`GET /interests/me`)
- [ ] Pull to refresh en "Mis intereses"

## F. UX / Estados

- [ ] Loading state visible en todas las pantallas de datos
- [ ] Empty state visible cuando no hay datos
- [ ] Error state con accion de reintento
- [ ] Estilos coherentes iOS/Android
- [ ] Navegacion sin loops ni pantallas bloqueadas

## G. Tecnico

- [x] `npm run typecheck` pasa
- [ ] Smoke run en Expo iOS
- [ ] Smoke run en Expo Android
