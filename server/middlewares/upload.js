const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(process.cwd(), 'public/assets/products');

// ✅ Create folder if not exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueName}${ext}`);
  },
});

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
  uploadSingle: upload.single('attachment'), // ✅ Changed to single
  convertToWebp,
};
