import fs from 'fs';
import path from 'path';
import https from 'https';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

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
  const cleanSlug = slug.trim();
  if (!cleanSlug) {
    console.error('¡El slug no puede estar vacío!');
    rl.close();
    process.exit(1);
  }

  rl.question(`2. Ingresa la URL base de tu servidor [Pulsar Enter para '${defaultHost}']: `, (hostInput) => {
    const host = hostInput.trim() || defaultHost;
    
    // Construct final URL
    const targetUrl = `${host}/?s=${cleanSlug}`;
    
    // Request with High Error Correction (ecc=H) to support the center logo overlay safely
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&ecc=H&data=${encodeURIComponent(targetUrl)}`;
    
    const tempPath = path.join(outputDir, `${cleanSlug}-temp.png`);
    const outputPath = path.join(outputDir, `${cleanSlug}-qr.png`);
    const logoPath = path.join(__dirname, '../src/assets/logo_transparent.png');
    
    console.log(`\nGenerando QR base para: ${targetUrl}...`);

    https.get(qrApiUrl, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Error al generar código QR de la API (Status: ${res.statusCode})`);
        rl.close();
        process.exit(1);
      }

      const fileStream = fs.createWriteStream(tempPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        
        console.log('Aplicando logo Ojito en el centro con borde redondeado...');
        
        const pythonScript = path.join(__dirname, 'overlay_logo.py');
        const execCommand = `python3 "${pythonScript}" "${tempPath}" "${logoPath}" "${outputPath}"`;
        
        exec(execCommand, (err, stdout, stderr) => {
          // Clean up temp file
          if (fs.existsSync(tempPath)) {
            try {
              fs.unlinkSync(tempPath);
            } catch (e) {}
          }
          
          if (err) {
            console.error('Error al aplicar el logo en el centro del código QR:', stderr || err.message);
            // Fallback: save the basic QR if the logo overlay failed
            try {
              fs.copyFileSync(tempPath, outputPath);
              console.log(`Se guardó el QR base (sin logo) en:\n👉 ${path.relative(process.cwd(), outputPath)}`);
            } catch (copyErr) {
              console.error('No se pudo guardar ni el QR base:', copyErr.message);
            }
          } else {
            console.log(`\n¡Éxito! Código QR personalizado guardado en:\n👉 ${path.relative(process.cwd(), outputPath)}`);
            console.log(`\nEste código QR redirigirá directamente al catálogo: ${targetUrl}`);
          }
          rl.close();
        });
      });
    }).on('error', (err) => {
      console.error('Error de red al conectar con la API de códigos QR:', err.message);
      rl.close();
    });
  });
});
