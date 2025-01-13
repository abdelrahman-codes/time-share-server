// config/multerConfig.js

const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const Fs = require('@supercharge/fs');
const ErrorHandler = require('../enums/errors');

// Dynamic storage engine
const getStorage = (destinationPath, isCv = false) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
      let ext = file.mimetype.split('/')[1];
      if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        ext = 'docx';
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        ext = 'xlsx';
      }
      cb(null, uuidv4() + '.' + ext);
    },
  });
};

// Check file type for images
function checkImageType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(ErrorHandler.badRequest({},'Only images are allowed'));
  }
}

// Check file type for documents, PDFs, and Excel files
function checkDocsType(file, cb) {
  const filetypes = /pdf|doc|docx|xls|xlsx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(ErrorHandler.badRequest({},'Documents Only (PDF, DOC, DOCX, XLS, XLSX)!'));
  }
}

// Check file type for all files
function checkAllTypes(file, cb) {
  cb(null, true);
}

// Init upload with different file type checks
const upload = (destinationPath, fileFilter, isCv = false) => {
  return multer({
    storage: getStorage(destinationPath, isCv),
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function (req, file, cb) {
      fileFilter(file, cb);
    },
  });
};

// Export different configurations
module.exports = {
  uploadImage: (destinationPath) => upload(destinationPath, checkImageType),
  uploadDocs: (destinationPath) => upload(destinationPath, checkDocsType),
  uploadAll: (destinationPath) => upload(destinationPath, checkAllTypes),
};
