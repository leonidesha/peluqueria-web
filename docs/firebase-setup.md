# 🔐 Configuración de Firebase - Peluquería Web

Este documento describe cómo se configuró Firebase para el proyecto de la peluquería. Incluye autenticación, base de datos y reglas de seguridad.

---

## 🚀 Proyecto Firebase

- **Nombre del proyecto:** `peluqueria-web`
- **URL del proyecto:** [https://console.firebase.google.com/project/peluqueria-web/overview](https://console.firebase.google.com/project/peluqueria-web/overview)
- **Fecha de configuración:** 26 de julio de 2025
- **Responsable:** Hansel Rodríguez

---

## 🔐 Autenticación

Se activaron los siguientes métodos de inicio de sesión:

| Método | Estado | Notas |
|-------|--------|------|
| Google | ✅ Activado | Permite login con cuenta de Gmail |
| Teléfono | ✅ Activado | Envía código SMS para verificar número |
| Dominios autorizados | `localhost` | Se agregará dominio real al publicar |

> ⚠️ Nota: No se requiere activar manualmente reCAPTCHA v3. Firebase lo maneja automáticamente en segundo plano cuando se usa `RecaptchaVerifier` en el código.

---

## Reglas de Seguridad

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 8, 27);
    }
  }
}


## 📦 Base de Datos: Cloud Firestore

Se crearon las siguientes colecciones para almacenar la información del sistema:

### Colecciones principales

| Colección | Descripción |
|---------|------------|
| `users` | Almacena información de clientes y administradores |
| `appointments` | Guarda las citas (fecha, hora, servicio, duración) |
| `treatments` | Registra los tratamientos aplicados por cita |

> 📌 Todas están vacías por ahora. Los documentos se crearán automáticamente cuando los usuarios reserven.

---

## ⚙️ Configuración para el Frontend (React)

Esta configuración debe usarse en el archivo `src/firebase.js` del proyecto React.

```js
const firebaseConfig = {
  apiKey: "AIzaSyAEfNB6U96_i4kmBTU4crAKXya1ZQXDpks",
  authDomain: "peluqueria-web-792f0.firebaseapp.com",
  projectId: "peluqueria-web-792f0",
  storageBucket: "peluqueria-web-792f0.firebasestorage.app",
  messagingSenderId: "687230116423",
  appId: "1:687230116423:web:0cbe5688796a4a7b270762"
};
