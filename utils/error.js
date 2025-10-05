const error = {};

error.serverErrorGenerator = (errObg) => {
  const errArr = new Error(errObg).toString().split(":");
  const err = errArr[errArr.length - 1].split(",")[0];

  return err;
};

module.exports = error;
