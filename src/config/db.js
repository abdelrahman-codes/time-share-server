const mongoose = require('mongoose');

const Connection = async () => {
  return await mongoose
    .connect(`${process.env.DATABASE_URL}`)
    .then((res) => console.log('Connection established'))
    .catch((err) => console.error(err));
};

module.exports = Connection;
