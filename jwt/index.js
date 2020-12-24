const jwt = require("jsonwebtoken");

function encodeData(data) {
  const encoded = jwt.sign(data, process.env.JWT_SECRET);
  return encoded;
}

function decodeData(encodedData) {
  const data = jwt.verify(encodedData, process.env.JWT_SECRET);
  return data;
}

module.exports = {
  encodeData,
  decodeData,
};
