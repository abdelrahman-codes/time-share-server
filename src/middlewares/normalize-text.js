const normalizeText = (req, res, next) => {
  // Function to normalize text
  function normalize(text) {
    if (!text) return text;
    return text.trim().replace(/ى/g, 'ي').replace(/أ/g, 'ا').replace(/إ/g, 'ا').replace(/آ/g, 'ا').replace(/ة/g, 'ه');
  }
  // Normalize any specific fields in the request body, query, or params
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = normalize(req.body[key]);
      }
    }
  }

  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = normalize(req.query[key]);
      }
    }
  }
  next();
};
module.exports = normalizeText;
