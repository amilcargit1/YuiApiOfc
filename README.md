<div align="center">

# 🌸 YuiAPI OFC

### API oficial para el ecosistema YuiBot-MD

**Simple · Modular · Estable · Sin Prisma · Todo a nombre de Yui**

</div>

---

## ✨ Sobre el proyecto

YuiAPI OFC usa como referencia la organización general de una API multi-herramientas como DvWilkerOFC, pero la implementación de este repositorio es propia y está adaptada al estilo **YuiBot-MD**.

La base está pensada para **Render**, con Express, Node.js y módulos independientes. No utiliza Prisma, ORM ni PostgreSQL obligatorio.

## 🧩 Módulos incluidos

- 🌸 `auth` — estado y autenticación por API key
- 🤖 `ai` — Gemini mediante API oficial y variable `GEMINI_API_KEY`
- 🛠️ `tools` — QR y captura web
- 🔎 `search` — Pinterest y TikTok
- 📥 `download` — Facebook, Instagram, X/Twitter, Pinterest, TikTok y YouTube
- ❤️ `health` — estado del servicio
- 📚 `info` — catálogo de endpoints

## 🔐 API key

Los endpoints de herramientas están protegidos. Configura en Render:

```env
YUI_API_KEY=tu_llave_privada
GEMINI_API_KEY=tu_llave_de_gemini
GEMINI_MODEL=gemini-2.5-flash
```

También se acepta `Authorization: Bearer TU_LLAVE` o `x-api-key: TU_LLAVE`.

## 📡 Rutas principales

| Método | Ruta | Auth |
|---|---|---|
| GET | `/api` | No |
| GET | `/api/health` | No |
| GET | `/api/info` | No |
| GET | `/api/auth/status` | No |
| GET | `/api/ai/gemini?text=Hola` | Sí |
| GET | `/api/tools/qr?text=Hola` | Sí |
| GET | `/api/tools/ssweb?url=https://example.com` | Sí |
| GET | `/api/search/pinterest?query=anime` | Sí |
| GET | `/api/search/tiktok?query=anime` | Sí |
| GET | `/api/download/facebook?url=URL` | Sí |
| GET | `/api/download/instagram?url=URL` | Sí |
| GET | `/api/download/twitter?url=URL` | Sí |
| GET | `/api/download/pinterest?url=URL` | Sí |
| GET | `/api/download/tiktok?url=URL` | Sí |
| GET | `/api/download/ytaudio?url=URL` | Sí |
| GET | `/api/download/ytvideo?url=URL` | Sí |

## 🚀 Render

Build:

```bash
npm install
```

Start:

```bash
npm start
```

La versión de Node está fijada a la línea **20.x** para evitar cambios inesperados del runtime.

## 📁 Estructura

```text
YuiApiOfc/
├── index.js
├── package.json
├── render.yaml
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── health.js
│   ├── info.js
│   ├── ai/
│   ├── tools/
│   ├── search/
│   └── download/
└── public/
    └── index.html
```

## ⚠️ Proveedores externos

Algunos módulos de descarga/búsqueda dependen de servicios externos. Si uno de esos servicios cambia o deja de responder, el endpoint devuelve un error controlado sin tumbar toda la API.

## 🌸 Identidad

Nombre de proyecto: **YuiAPI OFC**  
Marca: **Yui**  
Ecosistema: **YuiBot-MD**  
Base de datos/ORM: **ninguno obligatorio**  
Prisma: **no utilizado**

---

<div align="center">

**YuiAPI OFC · Todo a nombre de Yui 🌸**

</div>
