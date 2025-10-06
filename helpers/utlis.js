const crypto = require("crypto");

const utils = {};

// convert str to hash

utils.convertStrToHash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", process.env.HASH_SECRET_KEY)
      .update(str)
      .digest("hex");
    return hash;
  }

  return false;
};

// generate 20 character string:

utils.generateRandomStr = (strLen) => {
  const charLen = typeof strLen === "number" && strLen > 0 ? strLen : false;

  if (charLen) {
    const possibleChar = "abcdefghijklmnopqrstuvwxyz1234567890!@#$%";
    let output = "";

    for (let i = 1; i <= charLen; i++) {
      const randomChar = possibleChar.charAt(
        Math.floor(Math.random() * possibleChar.length)
      );
      output += randomChar;
    }
    return output;
  }
  return false;
};

module.exports = utils;
