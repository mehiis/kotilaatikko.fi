import multer from 'multer';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Saving file to:', path.join(__dirname, '../../public/uploads/'));
    cb(null, path.join(__dirname, '../../public/uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {fileSize: 5 * 1024 * 1024}, // 5MB limit
});

const uploadSingleImage = (fieldName) => upload.single(fieldName);
const uploadMultipleImages = (fieldName, maxCount) =>
  upload.array(fieldName, maxCount);

export {uploadSingleImage, uploadMultipleImages};
