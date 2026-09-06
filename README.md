<div align="center">

# 🌸 YuiAPI OFC

### API oficial para el ecosistema YuiBot-MD

**Simple · Modular · Estable · Sin Prisma**

</div>

---

## ✨ Sobre el proyecto

YuiAPI OFC toma como referencia la organización general de una API multi-herramientas como DvWilkerOFC, pero el código de este repositorio es una implementación propia y está orientado al estilo y ecosistema de **YuiBot-MD**.

La primera etapa prioriza una cosa: **que Render pueda iniciar la API sin errores innecesarios**.

## 🧩 Características

- Node.js + Express
- Arquitectura modular por rutas
- Página principal con estilo YuiBot-MD
- Endpoint `/api`
- Endpoint `/api/health`
- Endpoint `/api/info`
- Manejo centralizado de 404 y errores
- Apagado limpio con SIGTERM/SIGINT
- Compatible con Render
- ❌ Sin Prisma
- ❌ Sin PostgreSQL obligatorio
- ❌ Sin ORM

## 📁 Estructura

```text
YuiApiOfc/
├── index.js
├── package.json
├── render.yaml
├── routes/
│   ├── health.js
│   └── info.js
└── public/
    └── index.html
```

## 🚀 Ejecutar

```bash
npm install
npm start
```

La API usa `PORT` cuando está disponible; de lo contrario utiliza `3000`.

## 🔎 Endpoints iniciales

| Método | Ruta | Función |
|---|---|---|
| GET | `/` | Página de inicio |
| GET | `/api` | Información básica |
| GET | `/api/health` | Estado del servidor |
| GET | `/api/info` | Información de la API |

## 🛠️ Próxima etapa

Una vez confirmado que esta base funciona correctamente en Render, se pueden añadir módulos como:

- `search/`
- `download/`
- `tools/`
- `ai/`
- `anime/`
- autenticación por API key
- documentación automática

Cada módulo se añadirá de forma independiente para evitar que un endpoint roto impida iniciar toda la API.

---

<div align="center">

**YuiAPI OFC · Hecho para YuiBot-MD 🌸**

</div>
