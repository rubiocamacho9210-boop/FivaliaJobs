# FivaliaJobs Mobile Frontend (Expo + React Native)

Frontend mobile MVP basado en los wireframes de `Frontend/UI` y conectado al backend existente.

## Requisitos

- Node.js 18+
- npm 9+
- Expo CLI (via `npx expo`)

## Instalacion

```bash
cd Frontend
npm install
```

## Entorno (Punto 2)

1. Crear archivo `.env` en `Frontend/`:

```bash
cp .env.example .env
```

2. Configurar la URL del backend:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10:3000
```

### Notas por plataforma

- Dispositivo fisico (iOS/Android):
  - Usa la IP LAN de tu maquina, no `localhost`.
- Android Emulator:
  - Puedes usar `http://10.0.2.2:3000`.
- iOS Simulator:
  - Puede funcionar `http://localhost:3000`, pero se recomienda IP LAN para consistencia.

## Ejecutar app

```bash
npm start
```

Opciones:

```bash
npm run ios
npm run android
npm run typecheck
```

## Funcionalidad MVP actual

- Registro y login
- Persistencia de token (Zustand + AsyncStorage)
- Feed con `Me interesa`
- Detalle de post
- Crear post
- Mis intereses
- Mi perfil
- Perfil publico
- Setup/edicion de perfil

## Estructura

```text
src/
  components/
  constants/
  hooks/
  navigation/
  screens/
  services/api/
  store/
  types/
  utils/
```

## Flujo de ramas (Puntos 5 y 6)

- Branch de trabajo frontend limpia:
  - `feature/mobile-integration-clean`
- Base target:
  - `develop`
- No usar para merge:
  - `feature/mobile-integration` (rama local contaminada)

## Crear PR a develop (Punto 5)

URL directa:

```text
https://github.com/rubiocamacho9210-boop/FivaliaJobs/compare/develop...feature/mobile-integration-clean?expand=1
```

O con GitHub CLI:

```bash
gh pr create \
  --base develop \
  --head feature/mobile-integration-clean \
  --title "feat: mobile frontend MVP integration" \
  --body "Mobile MVP frontend based on Pencil wireframes, integrated with backend auth/posts/profile/interests."
```
