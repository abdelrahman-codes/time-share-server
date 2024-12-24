/**
 * Create an object composed of the object properties without omitted ones
 * @param {object} object - given object
 * @param {string[]} keys - given keys
 * @returns {object} an object composed of the object properties without omitted ones
 */
const omit = (object, keys) => {
  if (!keys.length) return object;
  const { [keys.pop()]: omitted, ...rest } = object;
  return omit(rest, keys);
};

module.exports = omit;
