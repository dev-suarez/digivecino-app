# DigiVecino App

Aplicación móvil para coordinación y seguridad vecinal: permite recibir y gestionar alertas, chatear con vecinos, consultar cámaras y el mapa del barrio.

## Requisitos

- [Node.js](https://nodejs.org/) \>= 18
- [Expo CLI](https://expo.dev/) (`npm install -g expo-cli`) o usar `npx expo`

## Instalación y ejecución

1. Clona el repositorio.
2. Instala las dependencias: `npm install`.
3. Copia `.env.example` a `.env` y completa tus credenciales.
4. Inicia el proyecto: `npm run dev`.

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example` y define las siguientes variables:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID`

Estas claves se utilizan en `lib/firebase.ts` mediante `process.env`.

## Despliegue

1. Asegúrate de haber configurado las variables de entorno.
2. Ejecuta `npm run build:web` para generar la versión web o utiliza [EAS Build](https://docs.expo.dev/build/introduction/) para crear binarios nativos.
3. Publica la app con `npx expo publish` o sube los binarios generados a las tiendas correspondientes.

## Capturas

![Logo de DigiVecino](assets/images/icon.png)
