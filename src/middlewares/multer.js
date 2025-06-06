// uploadMiddleware
const { MulterHelper } = require('../helpers/index');
const ErrorHandler = require('../enums/errors');

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
        throw ErrorHandler.badRequest({}, 'Invalid file type.');
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
      if (err)
        return res.status(400).json({ success: false, statusCode: 400, message: err.message, error: 'Invalid input' });

      if (req.file) {
        req.body[fieldName] = req.file.path;
      } else if (req.files) {
        if (Array.isArray(req.files)) {
          req.body[fieldName] = req.files.map((file) => file.path);
        } else {
          Object.keys(req.files).forEach((key, index) => {
            if (fieldName[index]?.maxCount == 1) req.body[key] = req.files[key][0].path;
            else req.body[key] = req.files[key].map((file) => file.path);
          });
        }
      }
      // Normalize form-data fields in req.body
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
          req.body[key] = req.body[key]
            .trim()
            .replace(/ى/g, 'ي')
            .replace(/أ/g, 'ا')
            .replace(/إ/g, 'ا')
            .replace(/آ/g, 'ا')
            .replace(/ة/g, 'ه');
        }
      }

      next();
    });
  };
};

module.exports = uploadMiddleware;
