
module.exports = function onlyUnique(value, index, self) {
    if (/\S/.test(value)) return self.indexOf(value) === index;
}