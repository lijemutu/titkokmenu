import fs from 'fs';
import path from 'path';
import https from 'https';
import readline from 'readline';
import { fileURLToPath } from 'url';

// ES modules helper for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const defaultHost = 'http://localhost:5173';
const outputDir = path.join(__dirname, '../public/qrcodes');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('=== Generador de Código QR para Ojito ===\n');

rl.question('1. Ingresa el slug del catálogo (ej. calzadosluna, cafeluna): ', (slug) => {
  if (!slug.trim()) {
    console.error('¡El slug no puede estar vacío!');
    rl.close();
    process.exit(1);
  }

  rl.question(`2. Ingresa la URL base de tu servidor [Pulsar Enter para '${defaultHost}']: `, (hostInput) => {
    const host = hostInput.trim() || defaultHost;
    
    // Construct final URL
    const targetUrl = `${host}/?s=${slug.trim()}`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(targetUrl)}`;
    
    const outputPath = path.join(outputDir, `${slug.trim()}-qr.png`);
    console.log(`\nGenerando QR para: ${targetUrl}...`);

    https.get(qrApiUrl, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Error al generar código QR de la API (Status: ${res.statusCode})`);
        rl.close();
        process.exit(1);
      }

      const fileStream = fs.createWriteStream(outputPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`\n¡Éxito! Código QR guardado correctamente en:\n👉 ${path.relative(process.cwd(), outputPath)}`);
        console.log(`\nEste código QR redirigirá directamente al catálogo: ${targetUrl}`);
        rl.close();
      });
    }).on('error', (err) => {
      console.error('Error de red al conectar con la API de códigos QR:', err.message);
      rl.close();
    });
  });
});
