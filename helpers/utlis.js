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

module.exports = utils;
