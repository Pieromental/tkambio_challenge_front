# TKAMBIO CHALLENGE FRONTEND

## 📌 Descripción

Este proyecto es el frontend del sistema TKAMBIO, desarrollado con Vue 3, Composition API y Sass. Está diseñado para interactuar con el backend alojado en el siguiente repositorio:

🔗 **Backend del Proyecto:** [tkambio_back](https://github.com/Pieromental/tkambio_back.git)

## 🚀 Tecnologías utilizadas

- Vue 3 + Vite
- TypeScript
- Vue Router
- Pinia (Opcional para gestión de estado)
- Axios (para peticiones HTTP)
- SASS (para estilos)
- Plugins personalizados para **alertas** y **loaders**
- Soporte para variables de entorno `.env`

---

## 📂 Estructura del Proyecto

```
📦 src
 ├📂 assets
 ┃ ├📂 icons (Iconos usados en la UI)
 ┃ ├📂 styles (Estilos globales en SASS)
 ├📂 components
 ┃ ├📂 _tests_ (Pruebas unitarias)
 ┃ ├ AlertComponent.vue
 ┃ ├ LoaderComponent.vue
 ├📂 composable
 ┃ ├📂 alert (Manejo de alertas con plugin)
 ┃ ├📂 crypto (Manejo de encriptación)
 ┃ ├📂 fetch (Lógica para peticiones HTTP con Axios)
 ┃ ├📂 loader (Manejo del loader con plugin)
 ├📂 modules
 ┃ ├📂 auth (Módulo de autenticación)
 ┃ ├📂 report (Módulo de reportes)
 ├📂 plugin (Plugins personalizados: alertPlugin, loaderPlugin)
 ├📂 router (Definición de rutas)
 ├📂 stores (Pinia store, opcional)
 ├📂 views
 ┃ ├ HomeView.vue
 ┃ ├ AboutView.vue
 ┃ ├ NotFound.vue
 ┃ ├ LoginView.vue
 ├ main.ts (Punto de entrada del proyecto)
 ├ App.vue (Componente raíz)
 ├ router/index.ts (Configuración de Vue Router)
 ├ .env (Variables de entorno)
 ├ tsconfig.json (Configuración de TypeScript)
 ├ vite.config.ts (Configuración de Vite)
```

---

## 🔧 Configuración del entorno

Antes de ejecutar el proyecto, asegúrate de configurar las variables de entorno.

### 🛡️ 1. Crear el archivo `.env` en la raíz del proyecto

Copia y pega las siguientes variables:

```
BASE_URL=http://localhost/

NODE_ENV=development


VITE_NAME_TOKEN=dJ12ksx_wqh821kjs


VITE_CLIENT_API_URL=http://localhost:8000

VITE_CLIENT_CRED_ENCRYPT_KEY=HdCQjbkyixu7y9_7wgMHJt6VVzM76izY

VITE_PUSHER_APP_KEY=local-app-key
VITE_PUSHER_APP_CLUSTER=mt1
VITE_PUSHER_HOST=127.0.0.1
VITE_PUSHER_PORT=6001
VITE_PUSHER_SCHEME=http
```

> 👐 **Nota:** Si la API backend no está en `http://localhost:8080`, cambia `VITE_CLIENT_API_URL` con la URL correcta.

---

## 💪 Instalación y ejecución

### 🛠️ 1. Instalar dependencias

```bash
npm install
```

### 🛠️ 2. Ejecutar en desarrollo

```bash
npm run dev
```

> La aplicación se ejecutará en `http://localhost:5173` (según la configuración de Vite).

### 🛠️ 3. Construir para producción

```bash
npm run build
```
---

## 🔐 Uso de Plugins Personalizados

### 🟢 **Loader Plugin**

Este plugin gestiona la pantalla de carga.

```ts
import { useLoader } from '@/composable/loader/useLoader'

const { showLoader, hideLoader } = useLoader()

showLoader() // Muestra el loader
hideLoader() // Oculta el loader
```

---

### ⚠️ **Alert Plugin**

Este plugin maneja las alertas personalizadas.

```ts
import { useAlert } from '@/composable/alert/useAlert'

const { showAlert } = useAlert()

await showAlert({
  type: 'success',
  title: 'Operación exitosa',
  message: 'Los datos fueron guardados correctamente.',
})
```

---

## 📼 Peticiones HTTP con Fetch Composable

Este proyecto usa un **Composable** para manejar peticiones HTTP con Axios.

```ts
import { useFetchHttp } from '@/composable/fetch/useFetchHttp'
import { resources } from '../api/ReportResource'

const { fetchHttpResource } = useFetchHttp()

const response = await fetchHttpResource(resources.getReports)
console.log(response)
```

Para descargas de archivos:

```ts
resources.getReport.download = true
const response = await fetchHttpResource(resources.getReport)
```

---
