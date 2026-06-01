# ✅ Checklist Entregable – Frontend

> Úsalo antes de entregar para asegurarte de que no falta nada.  
> **Fecha límite:** 02/06/2026 13:30

---

## 🎨 Identidad de la aplicación
- [ ] **Nombre épico** elegido para la SPA (no genérico)
- [ ] **Eslogan** definido
- [ ] **Logo / imagen representativa** (puede ser sencillo)
- [ ] **Paleta de colores** definida (puedes usar https://colorpalette.imageonline.co/es/)
- [ ] Favicon configurado

---

## 🏗️ Sprint 1 – Frontend para un único gamer

### Configuración base
- [ ] Proyecto **Nuxt4** creado y funcionando
- [ ] Cliente HTTP configurado (Axios / Fetch) apuntando a tu API
- [ ] Estilos aplicados (**Tailwind CSS** o **Bootstrap**)
- [ ] Estructura de carpetas organizada (views, components, services, router…)

### Pantallas y rutas
- [ ] **Home** `/`
  - [ ] Breve introducción al propósito de la app
  - [ ] Botones/enlaces a *Lista de juegos* y *Crear juego*
- [ ] **Lista de juegos** `/juegos`
  - [ ] Muestra los juegos en listado / tarjetas
  - [ ] **Ordenar** por puntuación
  - [ ] **Ordenar** por terminados / en proceso
  - [ ] **Filtrar** por nombre
  - [ ] **Filtrar** por categoría
  - [ ] **Filtrar** por etiqueta(s)
  - [ ] Acciones: editar, borrar, marcar como completado
- [ ] **Crear juego** `/juegos/nuevo`
  - [ ] Formulario completo con todos los campos
  - [ ] Botón "Crear"
  - [ ] Redirección tras crear
- [ ] **Editar juego** `/juegos/edicion/:id`
  - [ ] Formulario precargado con datos actuales
  - [ ] Botón "Guardar"
  - [ ] Redirección tras editar
- [ ] **Detalle de juego** `/juegos/:id` *(opcional pero recomendado)*
  - [ ] Muestra toda la información del juego

### Funcionalidades
- [ ] Crear juego → se refleja en la API y en la lista
- [ ] Listar con ordenación → funciona correctamente
- [ ] Listar con filtros → resultados coherentes
- [ ] Editar juego → cambios visibles inmediatamente
- [ ] Borrar juego → desaparece con confirmación (alerta o modal)
- [ ] Marcar como completado:
  - [ ] Cambia el estado visual
  - [ ] Registra la fecha automáticamente
  - [ ] Permite añadir notas y valoración 1–5

### Componentes reutilizables
- [ ] Componente de **tarjeta de juego**
- [ ] Componente de **formulario** (reutilizado en crear y editar)
- [ ] Componente de **lista / tabla**
- [ ] Componente de **filtros / búsqueda**

---

## 🔐 Sprint 2 – Frontend para múltiples gamers

### Autenticación
- [ ] **Registro** `/registro`
  - [ ] Formulario: email, alias, contraseña
  - [ ] Validaciones básicas (email válido, contraseña no vacía)
  - [ ] Mensaje de error si el email ya existe
- [ ] **Login** `/login`
  - [ ] Formulario: email, contraseña
  - [ ] Muestra errores si las credenciales son incorrectas
  - [ ] Guarda el **token** en `localStorage` (o cookie segura)
- [ ] **Perfil** `/perfil` *(opcional)*
  - [ ] Muestra alias y email del usuario logueado
  - [ ] Botón de cerrar sesión

### Protección de rutas
- [ ] **Rutas protegidas**: `/juegos`, `/juegos/nuevo`, `/juegos/edicion/:id`
  - [ ] Si no hay token → redirige a `/login`
- [ ] **Rutas públicas**: `/`, `/login`, `/registro`
  - [ ] Si ya hay token → redirige a `/juegos` (opcional pero recomendado)

### Actualización de pantallas existentes
- [ ] **Home actualizada** – muestra enlaces a registro/login o a la lista según sesión
- [ ] **Lista de juegos** – solo muestra los juegos del usuario autenticado
- [ ] **Crear juego** – asocia automáticamente el juego al usuario logueado
- [ ] Header/Navbar – muestra el alias del usuario y botón de logout cuando está logueado

### Manejo de sesión
- [ ] Cerrar sesión limpia el token y redirige a Home/Login
- [ ] Al recargar la página, la sesión se mantiene (token en localStorage)
- [ ] Peticiones autenticadas incluyen el token en el header (`Authorization: Bearer ...`)

---

## 📦 Entrega & documentación
- [ ] Código subido a **repositorio GitHub**
- [ ] `README.md` con:
  - [ ] Descripción del proyecto
  - [ ] Instrucciones para instalar y levantar el frontend
  - [ ] Enlace al backend / API
  - [ ] Enlace al despliegue online (si aplica)
- [ ] `.gitignore` adecuado (node_modules, dist, .env)

---

## 🧪 Última revisión (pruebas rápidas)
- [ ] Home carga correctamente y los estilos se ven bien
- [ ] Navegar entre rutas **sin recargar** la página (SPA)
- [ ] Crear juego → aparece en la lista con los datos correctos
- [ ] Editar juego → los cambios se guardan y se reflejan
- [ ] Borrar juego → desaparece tras confirmar
- [ ] Filtros y ordenaciones → funcionan en combinación
- [ ] Marcar completado → cambia visualmente y guarda fecha/notas/valoración
- [ ] Registro → crea cuenta nueva y redirige a login o home
- [ ] Login → guarda token y muestra contenido privado
- [ ] Acceder a `/juegos` sin login → redirige a `/login`
- [ ] Cerrar sesión → desaparece el usuario del header y el token se borra
- [ ] La app se ve bien en **móvil** (responsive)
