const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp'); // ✅ was missing - caused "sharp is not defined" on every upload

// ✅ was: path.join(process.cwd(), 'public/assets/products')
// That resolves relative to whatever directory the Node process was
// started from, which can differ between environments (local vs pm2 vs
// docker) and does NOT match where index.js actually serves product
// images from:
//   server.use('/assets/products', express.static(path.join(__dirname, './server/public/assets/products')))
// So sharp was writing files into <project-root>/public/assets/products
// while the static route only looks in <project-root>/server/public/assets/products
// — the file existed on disk but the URL returned to the client 404'd.
// Using this file's own __dirname makes the path independent of how/where
// the process is launched, and pointing it at server/public keeps it
// consistent with the mounted static route.
const uploadDir = path.join(__dirname, '../public/assets/products');

// ✅ Create folder if not exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Use memoryStorage instead of diskStorage.
// convertToWebp needs `file.buffer` to pass into sharp, but diskStorage
// writes straight to disk and never populates `buffer` - it only exists
// with memoryStorage. Since convertToWebp does its own toFile() write,
// we don't want multer writing the original file to disk at all.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('فقط فایل‌های JPG، JPEG، PNG و WEBP مجاز هستند'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

/**
 * Convert file to WEBP (optimized)
 */
const convertToWebp = async (originalFile) => {
  const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const outputPath = path.join(uploadDir, `${uniqueName}.webp`);

  await sharp(originalFile.buffer).rotate().resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 85, effort: 4 }).toFile(outputPath);

  return `/assets/products/${uniqueName}.webp`;
};

module.exports = {
  uploadSingle: upload.single('attachment'),
  convertToWebp,
};
