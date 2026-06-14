# 📣 Ideas de Posts para Muebleros en San Pedro Tultepec (Ojito MVP)

Este documento contiene estrategias, ideas de publicaciones y copys dirigidos a fabricantes y vendedores de muebles en **San Pedro Tultepec, Estado de México** (el hub mueblero vecino a San Mateo Atenco). 

---

## 🎯 Puntos de Dolor Clave del Negocio de Muebles
* **Las fotos planas no venden detalles:** El cliente de muebles quiere ver cómo se deslizan los cajones, la calidad de la veta de la madera, la textura del tapizado y los mecanismos (ej. sofás cama, mesas extensibles). El video vertical muestra esto en 5 segundos.
* **Espacio limitado en exhibición:** Muchos talleres fabrican decenas de modelos pero solo tienen espacio físico para exhibir 3 o 4 salas o comedores. Un catálogo en video muestra todo lo que pueden fabricar sin ocupar espacio físico.
* **Venta por WhatsApp y Marketplace:** Los fabricantes dependen mucho de responder preguntas repetitivas en redes. Conectar el video de cada mueble con un botón directo a WhatsApp agiliza la venta.
* **Tráfico en las calles:** Tultepec es un corredor donde la gente camina buscando opciones. Colocar un QR en los muebles en exhibición (o en la entrada) permite capturar clientes incluso si los vendedores están ocupados o el local está cerrado.

---

## 📝 Plantillas de Copys

### Opción 1: El enfoque en "Detalle y Mecanismos" (Demuestra la calidad)
* **Objetivo:** Mostrar que una foto de Facebook no es suficiente para vender un mueble de alto valor.

```text
🚨 LAS FOTOS DE MARKETPLACE NO LE HACEN JUSTICIA A LA CALIDAD DE TUS MUEBLES.

Vender una sala o una mesa de madera sólida no es como vender ropa. El cliente quiere ver los detalles:
- ¿Cómo se siente la tela del tapizado de cerca?
- ¿Qué tan suave se deslizan las correderas de los cajones?
- ¿Cómo se transforma ese sofá-cama en 3 segundos?

En una foto fija, todo se ve igual. En un video de 5 segundos estilo Reels/TikTok en pantalla completa, la calidad de tu trabajo se nota de inmediato.

Estoy buscando a 5 fabricantes de muebles aquí en San Pedro Tultepec que quieran digitalizar su catálogo en video de forma gratuita. 

Yo me encargo de armarles un catálogo móvil interactivo donde el cliente escanea un QR en tu local, ve tus muebles en acción y te manda mensaje directo a WhatsApp con el modelo exacto que le interesó.

No cobro nada por la configuración, solo quiero tu feedback para validar la herramienta con clientes reales.

👇 Comenta "MUEBLE" abajo y te mando un demo de 10 segundos de cómo se vería tu catálogo.
```

---

### Opción 2: El enfoque de "Showroom Virtual / Espacio Infinito"
* **Objetivo:** Resolver el problema del espacio físico limitado en los locales de exhibición de Tultepec.

```text
¿Te falta espacio en tu local de Tultepec para exhibir todos los modelos que puedes fabricar? 🛋️

Es el problema de siempre: tienes un taller capaz de hacer comedores increíbles, literas ahorradoras de espacio o trinchadores modernos, pero en el local de exhibición solo te caben dos salas.

¿Por qué no tener un "Showroom virtual" en video?

Con un código QR en tu mostrador o en tus muebles en exhibición, tus clientes pueden escanear y ver un feed de videos verticales de todos tus diseños disponibles, variantes de color de madera, telas y proyectos terminados que has entregado.

Estoy armando un piloto 100% gratuito exclusivo para 5 muebleros locales en Tultepec. Yo configuro tu catálogo interactivo en video para que tus clientes puedan ver todo lo que fabricas y pedir cotizaciones directas a tu WhatsApp.

¿Quieres expandir tu exhibición al doble sin rentar más local?

👇 Escribe "SHOWROOM" abajo y te mando el demo al privado.
```

---

### Opción 3: El enfoque de "Ventas en Piloto Automático para fines de semana"
* **Objetivo:** Capturar la atención de la gente que camina por Tultepec durante los fines de semana cuando hay mucho tráfico.

```text
¿Cuántas ventas pierdes los fines de semana en Tultepec porque tu local está lleno y no alcanzas a atender a todos los que entran? 🚶‍♂️🚶‍♀️

El fin de semana es cuando llega toda la gente, pero a veces no hay suficientes manos para explicar de qué madera está hecho, qué medidas tiene, o si se puede fabricar en otro color.

Imagina tener un vendedor digital en cada mueble. 

Colocas un pequeño portarretratos con un código QR en tu comedor estrella. El cliente lo escanea con su celular y ve un video interactivo rápido explicando los acabados, las opciones de tela y un botón que dice "Me interesa, cotizar envío".

Estoy buscando probar esta tecnología con 5 muebleros de San Pedro Tultepec de forma gratuita para medir cuántos prospectos extra capturan en un fin de semana.

Si te interesa ser uno de los 5 locales piloto sin costo de instalación:

👇 Deja un comentario con la palabra "PILOTO" y te envío el demo funcional a tu Messenger.
```

---

## 🛠️ Plan de Implementación para el Piloto en Tultepec

1. **Fotos reales de muebles locales:** Al contactar con ellos, ofréceles ir a su local a grabar 3 o 4 videos cortos (verticales, de 5 a 10 segundos, mostrando el mueble completo y luego haciendo zoom en las costuras, bisagras o la veta de la madera).
2. **Generación del QR:** Imprime un QR bonito en un portarretratos acrílico pequeño (puedes usar el script `generate_qr.js` del repo para que tenga la marca de Ojito). Colócalo sobre el mueble más vistoso del local.
3. **Flujo de WhatsApp:** Asegúrate de configurar la plantilla de WhatsApp en el JSON (ej. `whatsappTemplate`) con algo específico como:
   * *"¡Hola! Vi el video de la Mesa de Parota Extensible y me gustaría cotizarla con envío a [Dirección]."* Esto le ahorra tiempo al mueblero y le da un lead ultra calificado.

---

## 🤝 Guía Rápida de Onboarding (Paso a Paso)

Sigue esta secuencia en cuanto alguien comente tu publicación para maximizar el alcance de Facebook y concretar el piloto gratuito:

### 1. El Embudo de Conversión (Comentario Público + DM)
* **Paso A: Responde al comentario público inmediatamente:**
  Esto incrementa el engagement del post y avisa al usuario que revise su bandeja de entrada (ya que tu mensaje irá a "Solicitudes de Mensaje").
  * *Copy para el comentario público:*
    > *"¡Hola [Nombre]! Claro que sí, ya te envié los detalles y el demo funcional por mensaje privado. ¡Revisa tu bandeja de entrada o tu carpeta de solicitudes de mensaje! 📥"*
* **Paso B: Envíale un Mensaje Privado (DM):**
  Sé directo, amigable y cierra siempre con una pregunta de bajo roce para iniciar el diálogo.
  * *Copy para el DM:*
    > *"¡Hola [Nombre]! Qué gusto saludarte. Vi tu comentario en el grupo de muebleros.
    > 
    > Te comparto el enlace del demo para que veas en tu celular cómo funciona el catálogo interactivo en video vertical (estilo TikTok):
    > 👉 https://ojito-mvp.vercel.app/?s=cafeluna *(o el enlace de tu demo actual)*
    > 
    > Como mencioné en la publicación, estoy haciendo una prueba piloto 100% gratuita con muebleros locales de Tultepec donde yo me encargo de armar y configurar el catálogo digital.
    > 
    > Para ver cómo podemos adaptarlo mejor a tu negocio, ¿qué tipo de muebles fabricas o vendes principalmente?"*

### 2. Agenda la Visita Presencial (15-20 minutos)
La confianza local es clave. Si se muestran interesados en la pregunta del DM, proponles ir a su taller o sala de exhibición en Tultepec para capturar el contenido:
> *"Excelente. Para que el catálogo de tus muebles en video quede espectacular, me gustaría visitarte en tu local unos 15 minutos en un horario que te convenga. Yo grabo con mi cel los 3 muebles estrella en video vertical para mostrar los detalles y el mecanismo, armo tu showroom digital y te entrego de cortesía un código QR impreso en un stand para colocarlo en tu exhibición. ¿Qué día te queda mejor esta semana?"*

### 3. Grabación y Toma de Datos (En el Local/Taller)
Cuando visites su local de exhibición:
* **Graba los detalles clave:** Graba 3 o 4 tomas de cada mueble en formato vertical (5 a 10 segundos cada una). Muestra el mueble completo, luego abre un cajón, muestra el tapizado de cerca, o dobla el sofá cama.
* **Toma los datos:** Anota los nombres exactos de las piezas (ej. "Comedor Parota 6 Sillas"), precios, colores/telas disponibles y su **número de WhatsApp de ventas**.

### 4. Carga y Configuración Técnica
* **Optimiza:** Coloca los videos en la carpeta `raw_videos` y ejecuta el script: `node scripts/compress_videos.js`.
* **Sube a Cloudinary:** Sube los videos optimizados a Cloudinary para reproducción fluida e integra sus URLs.
* **Crea el Catálogo:** Configura el JSON del mueblero en `public/catalogs/{slug}.json` con sus productos y colores.
* **Genera el QR:** Corre el generador de QR `node scripts/generate_qr.js` para crear su QR con el logo de Ojito.

### 5. Entrega e Instalación Física
* **Imprime el QR:** Coloca el código QR en un portarretratos acrílico pequeño.
* **Colócalo en Tienda:** Pon el stand QR encima del mueble de exhibición correspondiente o en su mostrador. Pídele al vendedor que sugiera escanearlo a los clientes que estén dudando sobre otras telas o medidas del mueble.

### 6. Medición de Resultados (Feedback Day 3-5)
Visítalo o llámalo a los pocos días de la instalación para recoger sus comentarios (crucial para tus metas en [personal_goals.md](file:///home/erloto/source/repos/titkokmenu/personal_goals.md)):
* *¿Los clientes han escaneado el código QR del mueble?*
* *¿Te ha llegado alguna pregunta o cotización a WhatsApp a través del catálogo?*
* *¿El equipo de ventas lo está usando para mostrar modelos que no caben en tienda?*
* *¿Qué cambios o mejoras sugieres para hacerlo más útil?*
