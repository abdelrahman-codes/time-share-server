const fs = require('fs');
function deleteFile(path) {
  fs.unlink(path, (err) => {
    if (err) {
      return;
    }
  });
}
module.exports = deleteFile;
