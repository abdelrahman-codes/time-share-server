const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/s3');
const ErrorHandler = require('../enums/errors');

// Dynamic S3 storage engine
const getS3Storage = () => {
  return multerS3({
    s3: s3,
    bucket: 'rv-spaces',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
    },
  });
};

// File upload helper for DigitalOcean Spaces
const upload = (allowedFormats) => {
  return multer({
    storage: getS3Storage(allowedFormats),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      const filetypes = new RegExp(allowedFormats.join('|'), 'i');
      const extname = filetypes.test(file.originalname.toLowerCase());
      const mimetype = filetypes.test(file.mimetype);

      if (extname && mimetype) {
        return cb(null, true);
      }
      cb(ErrorHandler.badRequest({}, 'Invalid file type'));
    },
  });
};

// Export different upload configurations
module.exports = {
  uploadImage: () => upload(['jpeg', 'jpg', 'png']),
  uploadDocs: () => upload(['pdf', 'doc', 'docx', 'xls', 'xlsx']),
  uploadAll: () => upload(['jpeg', 'jpg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx']),
};
