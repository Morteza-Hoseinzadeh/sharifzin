const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const sharp = require('sharp');

const uploadDir = path.join(process.cwd(), 'public/uploads/products');

// اگر فولدر وجود نداشت بساز
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// Multer ابتدا فایل را در memory نگه می‌دارد
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('فقط فایل‌های JPG، JPEG، PNG و WEBP مجاز هستند'));
  }
};

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter });

/**
 * تبدیل فایل به WEBP
 */
const convertToWebp = async (buffer) => {
  const randomName = crypto.randomBytes(16).toString('hex');

  const filename = `${randomName}.webp`;

  const outputPath = path.join(uploadDir, filename);

  await sharp(buffer).rotate().resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 85, effort: 4 }).toFile(outputPath);

  return `/uploads/products/${filename}`;
};

module.exports = { uploadSingle: upload.single('attachment'), uploadMultiple: upload.array('attachments', 10), convertToWebp };
