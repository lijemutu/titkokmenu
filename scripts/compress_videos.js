import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../raw_videos');
const outputDir = path.join(__dirname, '../public/videos');

// Verify FFmpeg is installed
try {
  execSync('ffmpeg -version', { stdio: 'ignore' });
} catch (e) {
  console.error('❌ Error: FFmpeg no está instalado en este sistema.');
  console.error('Por favor, instálalo antes de correr este script:');
  console.error('👉 sudo apt update && sudo apt install -y ffmpeg');
  process.exit(1);
}

// Ensure directories exist
if (!fs.existsSync(inputDir)) {
  fs.mkdirSync(inputDir, { recursive: true });
  console.log(`📁 Carpeta de entrada creada en: ${path.relative(process.cwd(), inputDir)}`);
  console.log('👉 Por favor coloca tus videos pesados del celular en esa carpeta y vuelve a ejecutar este script.');
  process.exit(0);
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Detect AMD GPU (VAAPI support in FFmpeg and Linux DRI render device)
let useGpu = false;
const vaapiDevice = '/dev/dri/renderD128';

try {
  const encodersList = execSync('ffmpeg -encoders', { encoding: 'utf8' });
  const hasVaapiEncoder = encodersList.includes('h264_vaapi');
  const hasRenderDevice = fs.existsSync(vaapiDevice);

  if (hasVaapiEncoder && hasRenderDevice) {
    useGpu = true;
    console.log('⚡ AMD GPU Detectado! Utilizando aceleración por hardware VAAPI (h264_vaapi) para compresión ultra-rápida.\n');
  } else {
    console.log('ℹ️ Codificación por hardware (VAAPI) no disponible. Se utilizará la CPU (libx264).\n');
  }
} catch (err) {
  console.log('ℹ️ Se utilizará la CPU (libx264) para la codificación.\n');
}

// Allowed extensions
const videoExtensions = new Set(['.mp4', '.mov', '.avi', '.mkv', '.webm', '.3gp']);
const files = fs.readdirSync(inputDir);
const videoFiles = files.filter(f => videoExtensions.has(path.extname(f).toLowerCase()));

if (videoFiles.length === 0) {
  console.log('ℹ️ No se encontraron videos en la carpeta /raw_videos/');
  console.log('👉 Copia tus videos de celular en /raw_videos/ para comprimirlos.');
  process.exit(0);
}

console.log(`🚀 Iniciando compresión de ${videoFiles.length} videos...\n`);

videoFiles.forEach((file, index) => {
  const inputPath = path.join(inputDir, file);
  
  // Sanitize filename: lowercase, replace spaces and special characters with hyphens
  const ext = path.extname(file);
  const baseName = path.basename(file, ext);
  const cleanName = baseName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]/g, '-')     // replace non-alphanumeric with hyphens
    .replace(/-+/g, '-')            // remove duplicate hyphens
    .replace(/^-|-$/g, '');         // trim hyphens
    
  const outputFile = `${cleanName}.mp4`;
  const outputPath = path.join(outputDir, outputFile);

  console.log(`[${index + 1}/${videoFiles.length}] Procesando: "${file}"`);
  console.log(`   ➔ Destino: "public/videos/${outputFile}"`);

  // Build the FFmpeg command
  let ffmpegCommand = '';
  
  if (useGpu) {
    // Hardware accelerated encoding with VAAPI (AMD GPU)
    // 1. Initialize hardware device
    // 2. Standard CPU filters (scale and pad) to fit 720x1280 aspect ratio
    // 3. Format as nv12 and upload to GPU memory (hwupload)
    // 4. Encode on GPU using h264_vaapi at 1.0 Mbps
    ffmpegCommand = `ffmpeg -y -init_hw_device vaapi=gpu:${vaapiDevice} -filter_hw_device gpu -i "${inputPath}" -vf "scale=w=720:h=1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2:black,format=nv12,hwupload" -c:v h264_vaapi -b:v 1M -maxrate 1.5M -bufsize 3M -c:a aac -b:a 64k "${outputPath}"`;
  } else {
    // Standard software encoding (CPU - libx264)
    ffmpegCommand = `ffmpeg -y -i "${inputPath}" -vf "scale=w=720:h=1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2:black" -c:v libx264 -profile:v high -level:v 4.0 -pix_fmt yuv420p -crf 26 -preset fast -maxrate 1200k -bufsize 2400k -c:a aac -b:a 64k "${outputPath}"`;
  }

  try {
    // Run FFmpeg
    execSync(ffmpegCommand, { stdio: 'inherit' });
    
    // Compare file sizes
    const initialSize = fs.statSync(inputPath).size / (1024 * 1024);
    const finalSize = fs.statSync(outputPath).size / (1024 * 1024);
    const percentage = ((1 - finalSize / initialSize) * 100).toFixed(1);
    
    console.log(`   ✅ Completado: ${initialSize.toFixed(2)}MB ➔ ${finalSize.toFixed(2)}MB (Reducido un ${percentage}%)\n`);
  } catch (error) {
    console.error(`   ❌ Error al procesar "${file}":`, error.message);
    
    // If GPU fails, attempt CPU fallback immediately for this file
    if (useGpu) {
      console.log(`   ⚠️ Reintentando codificación por CPU (libx264) como plan de respaldo...`);
      const fallbackCommand = `ffmpeg -y -i "${inputPath}" -vf "scale=w=720:h=1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2:black" -c:v libx264 -profile:v high -level:v 4.0 -pix_fmt yuv420p -crf 26 -preset fast -maxrate 1200k -bufsize 2400k -c:a aac -b:a 64k "${outputPath}"`;
      try {
        execSync(fallbackCommand, { stdio: 'inherit' });
        const initialSize = fs.statSync(inputPath).size / (1024 * 1024);
        const finalSize = fs.statSync(outputPath).size / (1024 * 1024);
        const percentage = ((1 - finalSize / initialSize) * 100).toFixed(1);
        console.log(`   ✅ Completado por CPU: ${initialSize.toFixed(2)}MB ➔ ${finalSize.toFixed(2)}MB (Reducido un ${percentage}%)\n`);
      } catch (fallbackError) {
        console.error(`   ❌ Falló el respaldo por CPU:`, fallbackError.message);
      }
    }
  }
});

console.log('🎉 ¡Proceso finalizado! Todos los videos optimizados están listos en "public/videos/".');
