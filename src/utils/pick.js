/**
 * Create an object composed of the picked object properties
 * @param {object} object - given object
 * @param {string[]} keys - given keys
 * @returns {object} an object composed of the picked object properties
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key) && object[key]) obj[key] = object[key];
    return obj;
  }, {});
};

module.exports = pick;
