<div align="center">

# 🌸 YuiAPI OFC

### API oficial para el ecosistema YuiBot-MD

**Simple · Modular · Estable · JWT · API Keys · Sin Prisma · Todo a nombre de Yui**

</div>

---

## ✨ Sobre el proyecto

YuiAPI OFC toma como referencia la organización general de una API multi-herramientas como DvWilkerOFC, pero la implementación es propia y está adaptada al estilo **YuiBot-MD**.

La API ahora incluye un sistema completo de cuentas: **registro, inicio de sesión, sesiones JWT, perfiles, API keys personales, límites de uso, estadísticas y administración**.

## 🔐 Sistema de cuentas

### Registro

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "yuiuser",
  "email": "usuario@example.com",
  "password": "una-clave-segura"
}
```

La contraseña se guarda como hash con `bcryptjs`; nunca se guarda en texto plano.

### Inicio de sesión

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "una-clave-segura"
}
```

Devuelve una sesión JWT y la API key personal del usuario.

### Sesión

```http
Authorization: Bearer TU_JWT
```

También se puede autenticar un endpoint con:

```http
x-api-key: TU_API_KEY
```

## 👤 Endpoints de cuenta

| Método | Ruta | Función |
|---|---|---|
| GET | `/api/auth/status` | Estado del sistema de autenticación |
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/logout` | Cerrar sesión en el cliente |
| GET | `/api/auth/me` | Obtener mi perfil |
| PUT | `/api/auth/profile` | Actualizar perfil |
| GET | `/api/auth/stats` | Estadísticas de cuentas |
| GET | `/api/auth/dashboard-global` | Estadísticas globales |
| GET | `/api/auth/admin/all` | Listar usuarios — admin |
| POST | `/api/auth/admin/update` | Modificar usuario — admin |
| POST | `/api/auth/admin/delete` | Eliminar usuario — admin |

## 🧩 Módulos

- 🌸 `auth` — registro, login, JWT, perfiles y administración
- 🤖 `ai` — Gemini mediante `GEMINI_API_KEY`
- 🛠️ `tools` — QR y captura web
- 🔎 `search` — Pinterest y TikTok
- 📥 `download` — Facebook, Instagram, X/Twitter, Pinterest, TikTok y YouTube
- ❤️ `health` — estado del servicio
- 📚 `info` — catálogo de endpoints

## ⚙️ Variables de Render

Configura estas variables en Render:

```env
YUI_API_KEY=tu_llave_privada
YUI_ADMIN_USERNAME=Yui
YUI_ADMIN_EMAIL=correo-del-admin
YUI_ADMIN_PASSWORD=contraseña-del-admin
YUI_JWT_SECRET=una-cadena-larga-y-aleatoria
YUI_SESSION_EXPIRES=7d
GEMINI_API_KEY=tu_llave_de_gemini
GEMINI_MODEL=gemini-2.5-flash
```

**No subas las contraseñas, API keys ni `YUI_JWT_SECRET` al repositorio.**

## 🌐 Interfaz web

- `/` — inicio + catálogo de endpoints
- `/login.html` — inicio de sesión
- `/register.html` — registro
- `/profile.html` — perfil y estadísticas personales
- `/api` — información JSON de la API
- `/api/info` — catálogo JSON de endpoints
- `/api/health` — health check

## ⚠️ Persistencia

La base actual usa `data/users.json` para mantener la instalación **sin Prisma y sin ORM**. En Render, el almacenamiento local puede ser efímero durante nuevos deploys/reinicios. Para producción con cuentas persistentes se puede añadir posteriormente un almacenamiento externo (por ejemplo MongoDB) sin introducir Prisma.

## 🚀 Render

Build:

```bash
npm install
```

Start:

```bash
npm start
```

Node está fijado a **20.x** para mantener un runtime estable.

## 🌸 Identidad

**Nombre:** YuiAPI OFC  
**Marca:** Yui  
**Ecosistema:** YuiBot-MD  
**Prisma:** no utilizado  
**ORM:** no utilizado

---

<div align="center">

**YuiAPI OFC · Todo a nombre de Yui 🌸**

</div>
