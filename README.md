# Actividad 2.6 – Web Scraping con Node.js + Express + Cheerio

## Objetivo
Aplicar JavaScript en backend usando Node.js + Express con Cheerio para procesar HTML y extraer información estructurada.

## Instalación
```bash
npm install
```

## Ejecución
```bash
npm run dev
```
Servidor en `http://localhost:3000`

## Estructura
```
actividad_2_6_cheerio/
├── public/
│   └── index.html               # Maqueta HTML con formulario
├── src/
│   ├── app.js                   # Entrada principal
│   ├── routes/scrape.routes.js  # Rutas
│   ├── controllers/scrape.controller.js  # Controlador
│   └── services/scrape.service.js        # Lógica con Cheerio
├── package.json
└── README.md
```

## Endpoints

### GET /api/scrape/local
Lee el HTML local y extrae la estructura del formulario.
```
http://localhost:3000/api/scrape/local
```

### GET /api/scrape?url=
Lee una URL remota y extrae título y headings.
```
http://localhost:3000/api/scrape?url=https://books.toscrape.com
```

## Selectores utilizados
| Selector | Dato extraído |
|---|---|
| `$('title')` | Título de la página |
| `$('meta[name="description"]')` | Meta descripción |
| `$('h1, h2')` | Headings principales |
| `$('.campo')` | Campos del formulario |
| `$('input[type="text"]')` | Inputs de texto |
| `$('input[type="radio"]')` | Opciones de género |

## Errores manejados
| Código | Situación |
|---|---|
| 400 | Falta el parámetro url o HTML vacío |
| 404 | Archivo no encontrado o URL devuelve 404 |
| 500 | Error interno del servidor |
