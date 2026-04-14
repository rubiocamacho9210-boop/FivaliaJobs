# Release Notes - Mobile MVP Frontend

Fecha: 2026-04-14
Rama: `feature/mobile-integration-clean`

## Entregado

- Base Expo + TypeScript lista para desarrollo
- Navegacion auth + app con stack y tabs
- Estado de sesion con Zustand + persistencia AsyncStorage
- Cliente Axios centralizado con Bearer token e interceptores 401
- Integracion backend para:
  - Auth
  - Posts
  - Profile
  - Interests
- Pantallas MVP implementadas:
  - Login
  - Register
  - Feed
  - Post detail
  - Create post
  - My interests
  - My profile
  - Public profile
  - Profile setup/edit
- Estados base:
  - Loading
  - Empty
  - Error
- Pulido visual multiplataforma (iOS/Android)

## Notas operativas

- No incluye pagos/chat/push (fuera de alcance MVP)
- No se toca backend
- Branch recomendada para PR y merge:
  - `feature/mobile-integration-clean`
- Branch local no recomendada (contaminada):
  - `feature/mobile-integration`

## Pendiente antes de merge

- Ejecutar checklist manual de QA en `docs/QA_CHECKLIST.md`
- Completar smoke tests en iOS y Android reales/simulados
