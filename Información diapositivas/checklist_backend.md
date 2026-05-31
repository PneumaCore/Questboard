# ✅ Checklist Entregable – Backend

> Úsalo antes de entregar para asegurarte de que no falta nada.  
> **Fecha límite:** 02/06/2026 13:30

---

## 🏗️ Sprint 1 – API básica para un gamer

### Modelo de datos
- [ ] Modelo/entidad `Juego` creado con los campos orientativos:
  - `nombre`
  - `categoría`
  - `etiquetas`
  - `puntuaciónMetacritic` (extraída de usuarios de Metacritic)
  - `horasDedicación` (extraídas de HowLongToBeat)
  - `completado` (booleano)
  - `fechaCompletado` (automática al marcar como completado)
  - `notas` (opcional, al completar)
  - `valoración` (1–5 estrellas, opcional al completar)

### Endpoints CRUD
- [ ] **Crear juego** – `POST` (todos los campos anteriores)
- [ ] **Listar juegos** – `GET` con:
  - [ ] Ordenación por **puntuación**
  - [ ] Ordenación por **terminados / en proceso**
- [ ] **Filtrar juegos** – por:
  - [ ] Nombre
  - [ ] Categoría
  - [ ] Etiqueta(s)
- [ ] **Editar juego** – `PUT`/`PATCH`
- [ ] **Eliminar juego** – `DELETE`
- [ ] **Marcar como completado** – endpoint específico que:
  - [ ] Cambia `completado` a `true`
  - [ ] Actualiza `fechaCompletado` automáticamente
  - [ ] Permite añadir `notas` (opcional)
  - [ ] Permite añadir `valoración` 1–5 (opcional)

### Algoritmo de priorización
- [ ] Implementado el cálculo: `prioridad = puntuaciónMetacritic / horasDedicación`
- [ ] La prioridad se expone al listar juegos (ya sea calculada al vuelo o guardada)
- [ ] Probado con datos de ejemplo (ej. Juego A: 90/10=9, Juego B: 85/5=17)

### Base de datos & entorno
- [ ] Base de datos configurada y funcionando (MSYQL, POSTGRESQL)
- [ ] Variables de entorno gestionadas (.env)
- [ ] Servidor levantado sin errores

---

## 🔐 Sprint 2 – Soporte para múltiples gamers

### Autenticación & autorización
- [ ] Modelo/entidad `Usuario` creado con:
  - [ ] `email` (identificador único)
  - [ ] `contraseña` (encriptada / hasheada)
  - [ ] `alias`
- [ ] **Registro** – `POST` /registro (validación de email único)
- [ ] **Login** – `POST` /login (devuelve token o sesión)
- [ ] Middleware de protección de rutas (solo usuarios logueados)
- [ ] Cada juego está **asociado al usuario** que lo creó
- [ ] Un usuario **solo ve sus propios juegos** (filtrado por `userId` o similar)

### Seguridad
- [ ] Contraseñas nunca guardadas en texto plano (bcrypt, argon2…)
- [ ] Validación de datos en entrada (evitar campos vacíos, formatos erróneos)
- [ ] Manejo de errores sin filtrar información sensible

---

## 📦 Entrega & documentación
- [ ] Código subido a **repositorio GitHub**
- [ ] `README.md` con:
  - [ ] Descripción del proyecto
  - [ ] Instrucciones para instalar dependencias
  - [ ] Instrucciones para levantar el servidor
  - [ ] Ejemplos de llamadas a la API (cURL o similar)
- [ ] Colección de Bruno / Thunder Client / archivo `.http` (opcional pero recomendado)
- [ ] `.gitignore` adecuado (node_modules, .env, etc.)

---

## 🧪 Última revisión (pruebas rápidas)
- [ ] Crear un juego → devuelve 201 / objeto creado
- [ ] Listar juegos → aparece el nuevo juego
- [ ] Aplicar filtros y ordenaciones → resultados coherentes
- [ ] Editar un juego → cambios persistidos
- [ ] Eliminar un juego → desaparece de la lista
- [ ] Marcar como completado → fecha se rellena automáticamente
- [ ] Algoritmo → el juego con mayor ratio prioridad aparece primero cuando corresponde
- [ ] Registro de usuario → éxito con datos válidos, error si el email existe
- [ ] Login → devuelve token / sesión válida
- [ ] Acceder a rutas protegidas sin token → devuelve 401/403
- [ ] Crear juego logueado → el juego pertenece a ese usuario
- [ ] Listar juegos logueado → **no** aparecen juegos de otros usuarios
