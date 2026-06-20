/* global process */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawVideosDir = path.join(__dirname, '../raw_videos');
const publicVideosDir = path.join(__dirname, '../public/videos');
const catalogsDir = path.join(__dirname, '../public/catalogs');

// Verify FFmpeg is installed
try {
  execSync('ffmpeg -version', { stdio: 'ignore' });
} catch {
  console.error('❌ Error: FFmpeg is not installed on this system.');
  console.error('Please install it before running this script:');
  console.error('👉 sudo apt update && sudo apt install -y ffmpeg');
  process.exit(1);
}

// Ensure output directories exist
if (!fs.existsSync(publicVideosDir)) {
  fs.mkdirSync(publicVideosDir, { recursive: true });
}

// Find files to process
let videoFiles = [];
let sourceDir = '';

// Check if raw_videos folder exists and has files
if (fs.existsSync(rawVideosDir)) {
  const files = fs.readdirSync(rawVideosDir);
  videoFiles = files.filter(f => isVideoFile(f));
  sourceDir = rawVideosDir;
}

// If raw_videos is empty or does not exist, look in public/videos for direct MP4 files
if (videoFiles.length === 0) {
  console.log('ℹ️ No videos found in "raw_videos/". Checking "public/videos/" for .mp4 files...');
  if (fs.existsSync(publicVideosDir)) {
    const files = fs.readdirSync(publicVideosDir);
    // Only fetch top-level MP4 files, not folders
    videoFiles = files.filter(f => isVideoFile(f) && fs.statSync(path.join(publicVideosDir, f)).isFile());
    sourceDir = publicVideosDir;
  }
}

const removeAudio = process.argv.includes('--no-audio') || process.argv.includes('--remove-audio');

if (videoFiles.length === 0) {
  console.log('❌ No video files found to process.');
  console.log('👉 Please create a "raw_videos/" directory at the root and place your MP4 videos there, or place them in "public/videos/".');
  process.exit(0);
}

console.log(`🚀 Found ${videoFiles.length} video(s) to process in "${path.relative(process.cwd(), sourceDir)}"`);
if (removeAudio) {
  console.log('🔇 Audio mode: No audio (sound will be removed from videos).\n');
} else {
  console.log('🔊 Audio mode: Keeping audio (you can use --no-audio or --remove-audio to mute).\n');
}

// Video extensions pattern
function isVideoFile(filename) {
  const videoExtensions = new Set(['.mp4', '.mov', '.avi', '.mkv', '.webm', '.3gp']);
  return videoExtensions.has(path.extname(filename).toLowerCase());
}

// Helper to sanitize filenames to slugs
function getSlugName(filename) {
  const ext = path.extname(filename);
  const baseName = path.basename(filename, ext);
  return baseName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]/g, '-')     // replace non-alphanumeric with hyphens
    .replace(/-+/g, '-')            // remove duplicate hyphens
    .replace(/^-|-$/g, '');         // trim hyphens
}

// Store a map of original filenames to their HLS web URLs for updating catalogs
const videoMigrationMap = new Map();

videoFiles.forEach((file, index) => {
  const inputPath = path.join(sourceDir, file);
  const slugName = getSlugName(file);
  const outputVideoDir = path.join(publicVideosDir, slugName);

  // Ensure output folder for this video exists
  if (!fs.existsSync(outputVideoDir)) {
    fs.mkdirSync(outputVideoDir, { recursive: true });
  }

  const outputPlaylistPath = path.join(outputVideoDir, 'index.m3u8');
  const outputSegmentPattern = path.join(outputVideoDir, 'segment_%03d.ts');

  console.log(`[${index + 1}/${videoFiles.length}] Processing: "${file}"`);
  console.log(`   ➔ Destination: "public/videos/${slugName}/index.m3u8"`);

  // Build the FFmpeg HLS chunking command:
  // - High quality profile using CPU: -crf 20 (visually near-lossless)
  // - Format constraints to ensure vertical mobile aspect ratio (720x1280) with black padding if needed
  // - Keyframe alignment at 2s interval: -g 60 -sc_threshold 0 (assuming 30fps)
  // - Segment size: 2 seconds (-hls_time 2) for ultra-snappy TikTok style buffering
  const audioCodec = removeAudio ? '-an' : '-c:a aac -b:a 128k';
  const ffmpegCommand = `ffmpeg -y -i "${inputPath}" -vf "scale=w=720:h=1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2:black" -c:v libx264 -crf 20 -preset fast -g 60 -sc_threshold 0 ${audioCodec} -hls_time 2 -hls_playlist_type vod -hls_segment_filename "${outputSegmentPattern}" "${outputPlaylistPath}"`;

  try {
    execSync(ffmpegCommand, { stdio: 'inherit' });
    
    // Store mapping for catalog updates
    // Map both the exact filename and just '/videos/filename'
    videoMigrationMap.set(file, `/videos/${slugName}/index.m3u8`);
    videoMigrationMap.set(`/videos/${file}`, `/videos/${slugName}/index.m3u8`);
    
    console.log(`   ✅ Successfully chunked into HLS segments.\n`);
  } catch (error) {
    console.error(`   ❌ Error processing "${file}":`, error.message);
  }
});

// Update catalogs
if (fs.existsSync(catalogsDir)) {
  const catalogFiles = fs.readdirSync(catalogsDir).filter(f => f.endsWith('.json'));
  
  if (catalogFiles.length > 0) {
    console.log(`📂 Scanning catalogs in "${path.relative(process.cwd(), catalogsDir)}" to update video references...`);
    
    catalogFiles.forEach(catFile => {
      const catPath = path.join(catalogsDir, catFile);
      try {
        const catContent = fs.readFileSync(catPath, 'utf8');
        const catalog = JSON.parse(catContent);
        let updatedCount = 0;

        if (Array.isArray(catalog.items)) {
          catalog.items.forEach(item => {
            if (item.videoUrl) {
              // Check if we have a migration mapping for this video URL
              // Decode URL spaces or special characters just in case it is encoded
              const decodedUrl = decodeURIComponent(item.videoUrl);
              const basename = path.basename(decodedUrl);

              if (videoMigrationMap.has(basename)) {
                item.videoUrl = videoMigrationMap.get(basename);
                updatedCount++;
              } else if (videoMigrationMap.has(decodedUrl)) {
                item.videoUrl = videoMigrationMap.get(decodedUrl);
                updatedCount++;
              }
            }
          });
        }

        if (updatedCount > 0) {
          fs.writeFileSync(catPath, JSON.stringify(catalog, null, 2), 'utf8');
          console.log(`   📝 Updated ${updatedCount} video link(s) in catalog: "${catFile}"`);
        }
      } catch (err) {
        console.error(`   ❌ Error parsing or writing catalog "${catFile}":`, err.message);
      }
    });
  }
}

console.log('\n🎉 Finished HLS chunking process! All videos are processed and catalogs updated.');
