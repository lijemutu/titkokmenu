# 📋 Checklist de Datos para Alta de Nuevo Negocio (Ojito)

Usa esta lista como guía rápida para recopilar la información técnica, visual y de contenido necesaria para crear el archivo JSON del catálogo y generar su código QR.

---

## 🏢 1. Datos Generales del Negocio
* [ ] **Nombre del Negocio (`shopName`):** Nombre comercial exacto que aparecerá en el encabezado.
* [ ] **Slug de la URL (`shopSlug`):** Identificador único en minúsculas, sin espacios ni caracteres especiales (ej. `miche-luna`, `cafeluna`).
* [ ] **WhatsApp de Ventas (`whatsappNumber`):** Número de teléfono con código de país, sin espacios ni símbolos (ej. `527221234567`).
* [ ] **Mensaje de Bienvenida (`welcomeMessage`):** Texto de bienvenida o subtítulo debajo del nombre de la tienda.
* [ ] **Plantilla de Mensaje de WhatsApp (`whatsappTemplate`):** Texto automático que se enviará al hacer clic en un producto.
  * *Por defecto:* `¡Hola! Me interesa ordenar {itemName} (precio: ${price}) desde el menú digital.`

---

## 🎨 2. Identidad Visual (Temas)
* [ ] **Color Principal (`primaryColor`):** Código Hexadecimal del color dominante de la marca/negocio (ej. `#c084fc`).
* [ ] **Color de Acento (`accentColor`):** Código Hexadecimal para botones y llamados a la acción (ej. `#7928ca`).
* [ ] **Color del Texto (`textColor`):** Color legible para el texto sobre los fondos principales (ej. `#ffffff`).

---

## 🍔 3. Productos Estrella (MVP: 3 a 5 items)
Para cada producto que se agregará al catálogo interactivo en video:
* [ ] **ID del Producto (`id`):** Número único identificador (ej. `1`, `2`, `3`).
* [ ] **Nombre (`name`):** Nombre del platillo, bebida o mueble (ej. `Michelada Clásica`).
* [ ] **Precio (`price`):** Costo numérico del producto (ej. `85`).
* [ ] **Descripción (`description`):** Detalle breve del producto, ingredientes o medidas.
* [ ] **Video del Producto (`videoUrl`):** Enlace del video vertical subido a Cloudinary o CDN optimizado.

---

## 📹 4. Multimedia y Archivos Físicos
* [ ] **Videos Grabados (Formato Vertical):** Grabaciones rápidas de 5 a 10 segundos de cada producto en la carpeta local `/raw_videos/` para ser optimizados.
* [ ] **Código QR Brandeado:** Generado con `generate_qr.js` una vez definido el `shopSlug`.
* [ ] **Portarretratos / Stand Físico:** Impresión del QR en Canva y colocación en base acrílica o cartón para el local.
