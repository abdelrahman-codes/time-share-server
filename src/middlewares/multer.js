// uploadMiddleware
const { MulterHelper } = require('../helpers/index');
const ErrorHandler = require('../enums/errors');
const fs = require('fs');

const uploadMiddleware = (uploadType, storagePath, fileType, fieldName, maxCount) => {
  return (req, res, next) => {
    let upload;
    switch (fileType) {
      case 'image':
        upload = MulterHelper.uploadImage(storagePath);
        break;
      case 'docs':
        upload = MulterHelper.uploadDocs(storagePath);
        break;
      case 'all':
        upload = MulterHelper.uploadAll(storagePath);
        break;
      default:
        throw ErrorHandler.badRequest('Invalid file type.');
    }
    let multerUpload;
    switch (uploadType) {
      case 'single':
        multerUpload = upload.single(fieldName);
        break;
      case 'array':
        multerUpload = upload.array(fieldName, maxCount);
        break;
      case 'fields':
        multerUpload = upload.fields(fieldName);
        break;
      default:
        throw ErrorHandler.dynamicError(400, 'Invalid upload type.');
    }

    multerUpload(req, res, (err) => {
      if (err) return res.status(400).json({ success: false, code: 400, message: err.message, error: 'Invalid input' });

      if (req.file) {
        req.body[fieldName] = req.file.filename;
      } else if (req.files) {
        if (Array.isArray(req.files)) {
          req.body[fieldName] = req.files.map((file) => file.filename);
        } else {
          Object.keys(req.files).forEach((key, index) => {
            if (fieldName[index]?.maxCount == 1) req.body[key] = req.files[key][0].filename;
            else req.body[key] = req.files[key].map((file) => file.filename);
          });
        }
      }

      next();
    });
  };
};

module.exports = uploadMiddleware;
