import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PHOTOS_DIR = path.resolve('src/media/photos');
const BACKUP_DIR = path.resolve('src/media/photos_backup');

async function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'photos_backup') {
        getAllFiles(fullPath, fileList);
      }
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

async function optimizeImages() {
  console.log('⚡ Starting Aurum Nexus Image Optimizer...');
  const files = await getAllFiles(PHOTOS_DIR);

  if (files.length === 0) {
    console.log('No images found in src/media/photos to optimize.');
    return;
  }

  console.log(`Found ${files.length} images to process.`);

  for (const filePath of files) {
    const relative = path.relative(PHOTOS_DIR, filePath);
    const backupPath = path.join(BACKUP_DIR, relative);
    const backupParent = path.dirname(backupPath);

    // Create backup directory if needed
    if (!fs.existsSync(backupParent)) {
      fs.mkdirSync(backupParent, { recursive: true });
    }

    // Only backup if not already backed up
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
      console.log(`📁 Backed up: ${relative}`);
    }

    // Optimize with sharp
    try {
      const metadata = await sharp(filePath).metadata();
      const needsResize = metadata.width && metadata.width > 2000;

      let pipeline = sharp(filePath);
      if (needsResize) {
        pipeline = pipeline.resize({ width: 2000, withoutEnlargement: true });
      }

      // Convert to WebP
      const parsed = path.parse(filePath);
      const targetWebPPath = path.join(parsed.dir, `${parsed.name}.webp`);

      const buffer = await pipeline
        .webp({ quality: 84, effort: 4 })
        .toBuffer();

      // Write target
      fs.writeFileSync(targetWebPPath, buffer);

      // If original extension was not .webp, remove the old unoptimized original file from photos/
      if (parsed.ext.toLowerCase() !== '.webp') {
        fs.unlinkSync(filePath);
      }

      const origSize = (metadata.size ? metadata.size / 1024 : 0).toFixed(1);
      const newSize = (buffer.length / 1024).toFixed(1);
      console.log(`✅ Optimized: ${relative} -> ${parsed.name}.webp (${origSize}KB -> ${newSize}KB)`);
    } catch (err) {
      console.error(`❌ Error optimizing ${filePath}:`, err);
    }
  }

  console.log('✨ All images optimized successfully! Originals are preserved in src/media/photos_backup/');
}

optimizeImages().catch((err) => {
  console.error('Fatal error during optimization:', err);
  process.exit(1);
});
