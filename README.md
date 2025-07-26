## 1. 📝 Resumen del Proyecto

Esta aplicación web permite a los clientes de una peluquería **reservar, cancelar y reprogramar citas**, así como ver su historial de tratamientos. Los administradores pueden **gestionar el calendario completo**, modificar reservas y asignar roles. Las reservas también se pueden realizar a través de un **bot automatizado en WhatsApp** que guía al cliente paso a paso. El sistema incluye autenticación mediante **número de teléfono** o **cuenta de Google**.

---

## 2. 👥 Actores del Sistema

| Actor               | Descripción                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Cliente**         | Usuario que reserva citas, ve su historial y puede interactuar con el bot de WhatsApp.                              |
| **Administrador**   | Persona autorizada para gestionar el calendario, modificar citas, buscar clientes y asignar roles de administrador. |
| **Bot de WhatsApp** | Sistema automatizado que recibe mensajes, guía al cliente y registra reservas o cancelaciones.                      |

---

## 3. 📦 Módulos del Sistema

### 🔹 Módulo: Página Principal (Home)

- Mostrar nombre, logo, dirección y fotos del local.
- Sección de servicios (corte, color, tratamiento, etc.).
- Horarios de atención (días y horas).
- Botón flotante de WhatsApp.
- Botón principal: **“Reservar ahora”** (redirige a login o WhatsApp).
- Botón de **inicio de sesión / registro**.
- Selector de idioma (opcional, futuro: español / inglés).

---

### 🔹 Módulo: Autenticación

- Iniciar sesión con **cuenta de Google** (OAuth).
- Registrarse o iniciar sesión con **número de teléfono**:
  - Ingresar número.
  - Recibir código por SMS o WhatsApp.
  - Verificar código.
- Recuperar sesión automáticamente si ya está autenticado.
- Redirigir según rol:
  - Cliente → Dashboard
  - Administrador → Panel de control

---

### 🔹 Módulo: Reservas

- Reservar cita desde la web (solo usuarios logueados).
- Reservar mediante **WhatsApp Bot** (sin necesidad de login).
- Selección de:
  - Servicio (corte, barba, tintura, etc.)
  - Fecha y hora disponible (según disponibilidad)
- Confirmación automática:
  - Por mensaje de WhatsApp.
  - Por correo electrónico (opcional).
- Recordatorio automático:
  - Enviar mensaje 24 horas antes de la cita.

---

### 🔹 Módulo: Calendario

- Vistas disponibles: **diaria, semanal y mensual** (FullCalendar).
- Color diferenciado por tipo de servicio:
  - Ej: Corte = azul, Color = rojo, Tratamiento = verde.
- Funcionalidades:
  - **Administrador**: puede arrastrar, editar, eliminar o reprogramar cualquier cita.
  - **Cliente**: puede ver su cita y cancelarla si es necesario.
- Mostrar en cada bloque:
  - Nombre del cliente.
  - Servicio.
  - Duración.
  - Estado (confirmada, pendiente, cancelada).

---

### 🔹 Módulo: Perfil del Cliente

- Mostrar:
  - Próxima cita programada.
  - Historial de tratamientos:
    - Fecha.
    - Servicio realizado.
    - Notas del estilista (ej: “cabello seco, recomendado shampoo hidratante”).
- Botón: **“Iniciar chat en WhatsApp”** para consultas.

---

### 🔹 Módulo: Panel de Administrador

- Acceso exclusivo al calendario editable.
- Posibilidad de:
  - Cambiar duración de una cita.
  - Reprogramar o cancelar cualquier reserva.
  - Buscar clientes por nombre o número.
  - Asignar rol de **administrador** a otro usuario (mediante UID o correo).
- Vista de resumen diario/semanal de citas.

---

### 🔹 Módulo: Bot de WhatsApp

- Integración con Twilio o Meta API.
- Flujo automático:
  1. Cliente envía “Hola”.
  2. Bot verifica si ya tiene una cita futura.
  3. Pregunta: “¿Quieres reservar una cita?”
  4. Si dice “Sí”, pregunta:
     - Nombre completo.
     - Servicio deseado.
     - Fecha y hora preferida.
  5. Verifica disponibilidad.
  6. Confirma y guarda en Firebase.
  7. Envía mensaje:
     > “Tu cita está confirmada para el [fecha] a las [hora]. ¡Te esperamos!”
- También permite:
  - Cancelar cita (ver flujo más abajo).
  - Recibir promociones (ver módulo de promociones).

---

### 🔹 Módulo: Base de Datos (Firebase)

- Colección `users`:
  ```json
  { uid, name, phone, email, role ("client" o "admin"), createdAt }
  ```
- Colección `appointments`:
  ```json
  { id, userId, clientName, service, date, duration, status }
  ```
- Colección `treatments`:
  ```json
  { appointmentId, userId, service, notes, date }
  ```
- Relaciones entre colecciones mediante `userId` y `appointmentId`.

---

### 🔹 Módulo: Promociones

- Los administradores pueden crear promociones temporales:
  - Nombre, descripción, fecha de inicio y fin.
  - Ej: “10% de descuento en tinturas esta semana”.
- Automatización:
  - Una semana después de la última cita del cliente, enviar mensaje por WhatsApp:
    > “¡Hola [nombre]! Tenemos nuevos productos en venta: [lista]. Ven a probarlos.”

---

## 4. 🔄 Flujos de Usuario

### 🟢 Flujo: Cliente reserva por WhatsApp

1. Cliente envía “Hola” al número oficial.
2. Bot verifica si tiene citas futuras.
3. Pregunta: “¿Quieres reservar una cita?”
4. Cliente responde “Sí”.
5. Bot pregunta: nombre, servicio, fecha/hora preferida.
6. Sistema verifica disponibilidad.
7. Si está disponible:
   - Guarda la cita en Firestore.
   - Envía confirmación:
     > “Tu cita está confirmada para el [fecha] a las [hora].”
8. Si no está disponible, sugiere horarios alternativos.

---

### 🔴 Flujo: Cliente cancela cita por WhatsApp

1. Cliente envía “Hola”.
2. Bot detecta que tiene una cita futura.
3. Pregunta: “¿Quieres cancelar tu cita?”
4. Cliente responde “Sí”.
5. Bot elimina o actualiza el estado de la cita en Firestore.
6. Envía confirmación:
   > “Tu cita ha sido cancelada. Puedes reservar otra cuando quieras.”

---

### 🔵 Flujo: Cliente inicia sesión

1. Hace clic en “Iniciar sesión”.
2. Elige método:
   - **Google**: inicia sesión con OAuth.
   - **Teléfono**: ingresa número → recibe código → lo verifica.
3. Sistema recupera su rol (`client` o `admin`).
4. Redirige a su dashboard correspondiente.

---

## 5. 🛠️ Próximos Pasos

1. ✅ Completado: Especificación de funcionalidades.
2. 🎨 Crear wireframes en Figma (Tarea 2).
3. 🔧 Elegir stack técnico (confirmar Firebase, React, Node, Twilio).
4. 💾 Crear repositorio en GitHub con estructura de carpetas.
5. 🚀 Comenzar desarrollo del Home en HTML/CSS.
