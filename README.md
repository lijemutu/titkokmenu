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

## 📹 Compresión y Optimización de Video (FFmpeg + GPU)

Los celulares modernos graban videos muy pesados. El script `compress_videos.js` automatiza la conversión a formato vertical, escala a `720x1280` y comprime el peso a menos de `1.5 MB`.

> [!NOTE]
> Este script detecta automáticamente si tu máquina tiene una **tarjeta gráfica AMD** en Linux (`VAAPI`) y la utiliza para codificación por hardware ultra-rápida. Si no está configurada, utiliza la CPU (`libx264`) de forma segura como respaldo.

### Instrucciones de uso:
1. Instala FFmpeg en tu sistema:
   ```bash
   sudo apt update && sudo apt install -y ffmpeg
   ```
2. Crea una carpeta llamada `raw_videos` en la raíz del proyecto y copia tus videos pesados ahí.
3. Ejecuta el optimizador:
   ```bash
   node scripts/compress_videos.js
   ```
4. Los videos optimizados con nombres listos para la web se guardarán automáticamente en `public/videos/`.

---

## 🖨️ Generador de Códigos QR Personalizados

El script `generate_qr.js` ha sido mejorado para aplicar automáticamente la identidad visual de la marca **Ojito** sobre los códigos QR generados:

*   **Diseño de Impacto**: Redondea los bordes exteriores del código QR completo (con un contorno negro grueso de 10px) e integra el logo transparente de Ojito en el centro sobre una tarjeta blanca cuadrada de gran visibilidad (31% del total) y sin bordes.
*   **Garantía de Escaneo (Alta Tolerancia)**: Utiliza corrección de errores de nivel **High (30% - `ecc=H`)** para garantizar que los códigos se puedan escanear al instante por cualquier celular aunque el logo esté centrado.

### Instrucciones de uso:

1.  **Requisitos**: Asegúrate de tener Python 3 y la librería Pillow instalada (para el posprocesamiento de imagen):
    ```bash
    pip install Pillow
    ```
2.  **Ejecuta el script**:
    ```bash
    node scripts/generate_qr.js
    ```
3.  Sigue las instrucciones en pantalla para ingresar el **slug** del catálogo y la **URL del servidor**. El código personalizado se guardará de forma automática en `public/qrcodes/{slug}-qr.png`.

---

## 📋 Recetario de Comandos (Cheat Sheet)

Copia y pega estos comandos directamente en tu consola según lo que necesites hacer:

### 🌐 Servidor de Desarrollo
*   **Iniciar localmente**:
    ```bash
    npm run dev
    ```
*   **Iniciar expuesto en tu red Wi-Fi (usando tu IP)**:
    ```bash
    npm run dev -- --host 192.168.68.111
    ```
*   **Iniciar expuesto en tu red Wi-Fi (IP automática)**:
    ```bash
    npm run dev -- --host
    ```

### 🎬 Optimizar y Comprimir Videos
*   **Procesar carpeta `/raw_videos/`**:
    ```bash
    node scripts/compress_videos.js
    ```

### 🖨️ Generar Códigos QR (Modo Rápido / No Interactivo)
*   **Para pruebas locales (`http://localhost:5173`)**:
    ```bash
    echo -e "underprice\n\n" | node scripts/generate_qr.js
    ```
*   **Para producción (`https://ojito-mvp.vercel.app`)**:
    ```bash
    echo -e "underprice\nhttps://ojito-mvp.vercel.app" | node scripts/generate_qr.js
    ```

### 📦 Producción
*   **Compilar para Vercel/Producción**:
    ```bash
    npm run build
    ```

---

## 🧭 Flujo del Piloto Local (San Mateo Atenco)

1.  **MVP de Calzado/Café**: Usa los archivos `calzadosluna.json` y `cafeluna.json` como plantillas.
2.  **Graba contenido**: Graba 3 o 4 videos cortos (verticales de 5 a 10 segundos) de productos en una tienda piloto local con tu celular.
3.  **Sube los videos**: Súbelos a Cloudinary u otra plataforma CDN y actualiza el JSON.
4.  **Imprime y Coloca**: Genera el código QR, imprímelo y pon el stand QR en el mostrador de la tienda.
5.  **Prueba e itera**: Observa a los clientes escanearlo, recopila sus comentarios cara a cara y ajusta el catálogo.
