const multer = require('multer');
const ErrorHandler = require('../enums/errors');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

// Dynamic storage engine for Cloudinary
const getCloudinaryStorage = (folder, allowedFormats) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder || 'uploads',
      allowed_formats: allowedFormats || ['jpeg', 'jpg', 'png', 'pdf', 'docx', 'xlsx'], // Adjust formats as needed
      public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
    },
  });
};

// Check file type for images
function checkImageType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(file.originalname.toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(ErrorHandler.badRequest({}, 'Only images are allowed'));
  }
}

// Check file type for documents
function checkDocsType(file, cb) {
  const filetypes = /pdf|doc|docx|xls|xlsx/;
  const extname = filetypes.test(file.originalname.toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(ErrorHandler.badRequest({}, 'Documents Only (PDF, DOC, DOCX, XLS, XLSX)!'));
  }
}

// General file type check (no restrictions)
function checkAllTypes(file, cb) {
  cb(null, true);
}

// Init upload with different file type checks for Cloudinary
const upload = (folder, fileFilter, allowedFormats) => {
  return multer({
    storage: getCloudinaryStorage(folder, allowedFormats),
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function (req, file, cb) {
      fileFilter(file, cb);
    },
  });
};

// Export different configurations
module.exports = {
  uploadImage: (folder) => upload(folder, checkImageType, ['jpeg', 'jpg', 'png']),
  uploadDocs: (folder) => upload(folder, checkDocsType, ['pdf', 'docx', 'xlsx']),
  uploadAll: (folder) => upload(folder, checkAllTypes),
};
