README – Cute Rescue (Proyecto PetTech)

📌 Descripción del Proyecto

Cute Rescue es una aplicación de geolocalización de mascotas, en este proyecto la funcionalidad de GPS es una simulación. Nuestra aplicación también está orientada al cuidado inteligente de mascotas, ofreciendole al usuario diversas herramientas para el día a día como un recordatorio de vacunas/pipetas/antiparasitarios, un listado de las veterinarias 24 hrs, una sección estática de eventos del gobierno para animales.


 Qué funcionalidades están implementadas?

 🔹 👤 Perfil del Usuario (LOGIN Y REGISTRO)
Datos personales editables.
Foto.
Ubicación.
Actualización de información.

 🔹 📍 Botón de Emergencia
Activa una simulación de una mascota en movimiento.
Renderiza un modal de alerta y modifica la UI del navbar, de blanco a un naranja más llamativo.
Se activa un segundo modal inhabilitando al usuario navegar por el sitio, obligandolo a rastrear a su mascota.
Ofrece un botón “Encontré a mi mascota” para detener la simulación.

 🔹 📍 Botón de Captura (screenshot)
 Enviamos un mail (con EmailJS) al mail registrado del usuario con la información de ubicación de su mascota, proporcionandole un Link hacia Google Maps con la misma ubicación que figura en la aplicación.

🔹 🐶 Gestión de Mascotas
Un modal con un formulario que agrega una mascota.
Modal de Editar datos (nombre, especie, raza, foto, etc.).
Imagen con previsualización local.
Tarjeta con ubicación actual.

🔹 🩺 Documentación Veterinaria
Un select con las mascotas que carga el usuario.
3 secciones para cargar documentación veterinaria. CRUD completo (crear, editar y eliminar).
La posibilidad de editar y eliminar esta documentación.
Alertas activas/inactivas (activamos notificaciones o desactivamos).

🔹 🔔 Notificaciones
Notificaciones activas según vencimientos veterinarios.
Campana con contador.
Marcar como leídas.

🔹 🔒 Sistema de Autenticación 
Registro.
Login.
Logout.
Verificación en Supabase.


🛠️ Tecnologías Utilizadas

Frontend
React + Vite
React Router
Tailwind CSS
Material Tailwind
Leaflet + React Leaflet (mapas)
EmailJS (envío de ubicaciones por correo)
React Context API (estado global)
Framer Motion (opcional si lo agregaste después)

Backend
Supabase
Autenticación
Base de datos Postgres
RLS (Row Level Security)
Storage (fotos de usuarios y mascotas, buckets con policies configuradas)
Realtime (actualización GPS)


💻 Qué tecnologías se utilizaron, qué comandos son necesarios ejecutar para instalarlas?

⭐Instalar dependencias
npm install

⭐Instalar Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

⭐Instalar React Leaflet + Leaflet
npm install react-leaflet leaflet

⭐Instalar EmailJS
npm install emailjs-com

⭐Configurar variables de entorno (enviado en un txt)

⭐Ejecutar el proyecto
npm run dev

▶️ Uso del Proyecto

Registrarse o iniciar sesión.
Agregar una mascota.
Modificar cualquier dato de usuario o mascota.
Visualizar la mascota en el dashboard.
Activar Modo Viaje o Emergencia.
Seguir movimiento en tiempo real (simulado).
Enviar la captura o reportar mascota encontrada.
Consultar documentación y notificaciones.