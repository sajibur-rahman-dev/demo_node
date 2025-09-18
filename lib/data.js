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

// dataLib - module scaffolding

const DB = {};

// base dir

DB.baseDir = path.join(__dirname, "/../.data");

// file create handler

DB.create = (dir, fileName, data, callback) => {
  fs.open(
    `${DB.baseDir}/${dir}/${fileName}.json`,
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
        callback("open error");
      }
    }
  );
};

// DB module exports

module.exports = DB;
