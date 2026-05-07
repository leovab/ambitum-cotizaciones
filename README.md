# Ambitum — Sistema de Cotizaciones Geotécnicas

Sistema web completo para la gestión de cotizaciones de **Ambitum Geología y Ambiente S.A.**

🔗 **[Abrir aplicación →](https://TU-USUARIO.github.io/ambitum-cotizaciones/)**

---

## ¿Qué incluye?

| Módulo | Descripción |
|--------|-------------|
| 📋 Nueva cotización | Calculadora completa para estudios geotécnicos (SPT, DPL, ensayos) |
| 📄 Otra cotización | Cotizaciones libres: consultoría, informes, monitoreo, topografía, etc. |
| 🗂 Registro | Base de datos compartida de todas las cotizaciones |
| 💰 Cuentas por cobrar | Tracking de adelanto 50% y saldo 50% por cotización |
| 📊 Reportería | Análisis de montos, utilidades, comisiones y estados |
| ⚙️ Precios unitarios | Edición de costos base sin tocar código |
| 🔗 Conexión API | Configuración del backend de Google Sheets |

## Acceso rápido

La aplicación funciona **directamente en el navegador** sin instalación. Solo abra el enlace publicado.

Los datos se guardan en **Google Sheets** a través de un backend de Google Apps Script.

---

## Instalación del backend (Google Apps Script)

El backend conecta la app con Google Sheets para almacenamiento compartido.

### Pasos

1. Abra [script.google.com](https://script.google.com) e inicie sesión con su cuenta de Google
2. Cree un **Nuevo proyecto** y borre el código por defecto
3. Copie y pegue el contenido completo del archivo [`ambitum_gas_backend.js`](./ambitum_gas_backend.js)
4. Guarde con `Ctrl+S` y nombre el proyecto **"Ambitum Cotizaciones API"**
5. Ejecute la función **`setupSheets`** una sola vez (crea la hoja de cálculo en Google Drive)
   - La primera vez pedirá permisos → haga clic en **"Revisar permisos"** → seleccione su cuenta → **"Configuración avanzada"** → **"Ir a Ambitum Cotizaciones API"** → **"Permitir"**
6. Publique: **Implementar → Nueva implementación**
   - Tipo: **Aplicación web**
   - Ejecutar como: **Usted**
   - Quién tiene acceso: **Cualquier persona**
7. Copie la URL generada y péguela en la app en **Conexión API → Guardar URL personalizada**

> La hoja de cálculo `Ambitum_Cotizaciones_DB` se crea automáticamente en su Google Drive con dos pestañas: `Cotizaciones` y `Precios`.

---

## Publicar en GitHub Pages

1. Suba estos archivos a un repositorio en [github.com](https://github.com)
2. Vaya a **Settings → Pages**
3. En **Source** seleccione **"Deploy from a branch"**
4. Branch: `main` / Carpeta: `/ (root)`
5. Haga clic en **Save**
6. En unos minutos la app estará disponible en `https://TU-USUARIO.github.io/NOMBRE-REPO/`

---

## Estructura del repositorio

```
ambitum-cotizaciones/
├── index.html              ← Aplicación principal (abrir en navegador)
├── ambitum_gas_backend.js  ← Backend para Google Apps Script
└── README.md               ← Esta guía
```

---

## Cuentas bancarias (datos de la empresa)

**Ambitum Geología y Ambiente S.A.** | Ced. Jur. 3-101-711855

| Banco | Moneda | IBAN |
|-------|--------|------|
| Banco Nacional | Colones | CR95015110710010009523 |
| Banco Nacional | Dólares | CR12015110710026003698 |
| BAC | Colones | CR70010200009525423221 |
| BAC | Dólares | CR31010200009525423147 |

---

## Contacto

**Lic. Patrick Durán L.** — Geólogo + Gerente General  
C.G.C.R. 326 | +506 8374-7669  
pduran@ambitumcr.com | [ambitumcr.com](https://ambitumcr.com)
