# 📱 Ojito — ¡Échale un ojito!

Ojito es una plataforma de **catálogos interactivos móviles en formato de video vertical tipo TikTok** para negocios locales. Está diseñada para que los clientes escaneen un código QR físico, vean los productos en pantalla completa (video/demo) y completen la compra o hagan preguntas directamente a través de WhatsApp.

Este proyecto está optimizado como un MVP móvil-first rápido e interactivo, centrado en el piloto local para **San Mateo Atenco, México**.

---

## 🛠️ Stack Tecnológico

*   **Frontend**: React (Vite) + Vanilla CSS (Ajuste fluido a `100dvh` para navegadores móviles).
*   **Routing**: Enrutamiento client-side ligero basado en parámetros de consulta (`/?s=slug`), compatible con cualquier hosting estático gratuito (Vercel, Netlify, GitHub Pages).
*   **Temas Dinámicos**: Los colores de la app cambian según el catálogo abierto (establecidos en el JSON).
*   **QR Generator**: Script nativo en Node.js para generar códigos de barras QR apuntando a catálogos específicos.

---

## 🚀 Comenzar en local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar servidor de desarrollo
```bash
npm run dev
```
Abre en tu navegador `http://localhost:5173`.

---

## 📂 Estructura de Catálogos (JSON Schema)

Los catálogos están en la carpeta `public/catalogs/` y siguen el siguiente esquema JSON:

```json
{
  "shopName": "Nombre de la Tienda",
  "shopSlug": "nombretienda",
  "whatsappNumber": "527221234567",
  "welcomeMessage": "Mensaje de bienvenida al escanear.",
  "whatsappTemplate": "¡Hola! Estoy interesado en {itemName} (precio: ${price}).",
  "theme": {
    "primaryColor": "#c084fc",
    "accentColor": "#7928ca",
    "textColor": "#ffffff"
  },
  "items": [
    {
      "id": "1",
      "name": "Nombre del Producto",
      "price": 850,
      "description": "Descripción detallada del artículo.",
      "videoUrl": "https://url-del-video-en-cloudinary.mp4"
    }
  ]
}
```

*   **Nota**: Modifica las propiedades de WhatsApp y las URLs de los videos para cada tienda. Puedes cargar tus propios videos a **Cloudinary** y sustituir los `videoUrl` con el enlace directo.

---

## 🖨️ Generador de Códigos QR

Para generar el código QR que se colocará en el mostrador del negocio físico:

1.  Ejecuta el script:
    ```bash
    node scripts/generate_qr.js
    ```
2.  Escribe el slug del catálogo correspondiente (ej. `calzadosluna` o `cafeluna`).
3.  Escribe la URL base donde está alojada tu aplicación (ej. presiona Enter para usar `http://localhost:5173` o especifica tu URL de Vercel/Netlify).
4.  El código QR se generará automáticamente en `public/qrcodes/` con el nombre `{slug}-qr.png`.

---

## 🧭 Flujo del Piloto Local (San Mateo Atenco)

1.  **MVP de Calzado/Café**: Usa los archivos `calzadosluna.json` y `cafeluna.json` como plantillas.
2.  **Graba contenido**: Graba 3 o 4 videos cortos (verticales de 5 a 10 segundos) de productos en una tienda piloto local con tu celular.
3.  **Sube los videos**: Súbelos a Cloudinary u otra plataforma CDN y actualiza el JSON.
4.  **Imprime y Coloca**: Genera el código QR, imprímelo y pon el stand QR en el mostrador de la tienda.
5.  **Prueba e itera**: Observa a los clientes escanearlo, recopila sus comentarios cara a cara y ajusta el catálogo.
