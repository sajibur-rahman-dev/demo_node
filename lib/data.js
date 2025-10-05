/**
 *
 * Title : Handle req and res
 * Description : Handler function for req and res
 * Author : Sajibur Rahman
 * Date : 19 sept., 2025
 *
 */

// dependencies

const fs = require("fs");
const path = require("path");
const { serverErrorGenerator } = require("../utils/error");
const { parseJson } = require("../utils/convertJson");

// dataLib - module scaffolding

const lib = {};

// base dir

lib.baseDir = path.join(__dirname, "/../.data");

// file create handler

lib.create = (dir, fileName, data, callback) => {
  fs.open(
    `${lib.baseDir}/${dir}/${fileName}.json`,
    "wx",
    (openErr, fileDescriptor) => {
      if (!openErr) {
        const savedData = JSON.stringify(data);
        fs.writeFile(fileDescriptor, savedData, (writeErr) => {
          if (!writeErr) {
            fs.close(fileDescriptor, (closeError) => {
              if (!closeError) {
                callback(false);
              } else {
                callback("File closing error");
              }
            });
          } else {
            callback("writing Error");
          }
        });
      } else {
        const err = serverErrorGenerator(openErr);
        callback(err);
      }
    }
  );
};

lib.read = (dir, fileName, callback) => {
  fs.readFile(`${lib.baseDir}/${dir}/${fileName}.json`, "utf8", (err, data) => {
    const resErr = serverErrorGenerator(err);

    callback(err, parseJson(data));
  });
};

lib.readFolder = (dir, callback) => {
  fs.readdir(`${lib.baseDir}/${dir}`, (err, files) => {
    callback(err, files);
  });
};

lib.update = (dir, fileName, data, callback) => {
  fs.open(
    `${lib.baseDir}/${dir}/${fileName}.json`,
    "r+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        fs.ftruncate(fileDescriptor, (tErr) => {
          const updatedData = JSON.stringify(data);
          if (!err) {
            fs.writeFile(fileDescriptor, updatedData, (wErr) => {
              if (!wErr) {
                fs.close(fileDescriptor, (cErr) => {
                  if (!cErr) {
                    callback(false);
                  } else {
                    callback("file closing error");
                  }
                });
              } else {
                callback("file write error");
              }
            });
          } else {
            callback("file truncate error");
          }
        });
      } else {
        const openError = serverErrorGenerator(err);
        callback(openError);
      }
    }
  );
};

lib.remove = (dir, fileName, callback) => {
  fs.unlink(`${lib.baseDir}/${dir}/${fileName}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      console.log(err);
      const deleteErr = serverErrorGenerator(err);
      callback(deleteErr);
    }
  });
};

// DB module exports

module.exports = lib;
