module.exports = async function saveDocumentWithUniqueUUID(doc, maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await doc.save();
      return doc; // Success, return the saved document
    } catch (err) {
      if (err.code === 11000)
        // Duplicate key error
        doc.uuid = generateRandomNumber(11); // Generate a new random number
      else return false;
    }
  }
  return false;
};
