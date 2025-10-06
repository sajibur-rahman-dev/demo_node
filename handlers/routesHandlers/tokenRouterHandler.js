/**
 *
 * Title :Token route handlers
 * Description : Handle token related route
 * Author : Sajibur Rahman
 * Date : 6 oct., 2025
 *
 */

// dependencies;

const crypto = require("crypto");
const { convertStrToHash, generateRandomStr } = require("../../helpers/utlis");
const { read, create, update, remove } = require("../../lib/data");

// handler - module scaffolding

const handler = {};

handler.allowedMethods = ["get", "post", "put", "delete"];

// about handler
handler.tokenRouteHandler = (requestedParamaeters, callback) => {
  if (handler.allowedMethods.includes(requestedParamaeters.method)) {
    handler._token[requestedParamaeters.method](requestedParamaeters, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

// method handler

handler._token.get = (requestedParamaeters, callback) => {
  const requestedQueries = { ...requestedParamaeters.query };

  const tokenId =
    typeof requestedQueries.tokenId === "string" &&
    requestedQueries.tokenId.trim().length > 0
      ? requestedQueries.tokenId
      : "";

  if (tokenId) {
    read("tokens", tokenId, (err, token) => {
      if (!err && token) {
        callback(200, token);
      } else {
        callback(500, {
          message: "token not found!!!",
        });
      }
    });
  } else {
    callback(400, {
      error: "bad request",
    });
  }
};

handler._token.post = (requestedParamaeters, callback) => {
  const userData = { ...requestedParamaeters.body };

  const phone =
    typeof userData?.phone === "string" && userData?.phone?.trim().length === 11
      ? userData?.phone
      : "";

  const password =
    typeof userData?.password === "string" &&
    userData?.password?.trim().length > 0
      ? userData?.password
      : "";

  if (phone && password) {
    read("users", phone, (err, user) => {
      if (!err && user) {
        if (user.password === convertStrToHash(password)) {
          const tokenId = generateRandomStr(20);
          const expire = Date.now() + 60 * 60 * 1000;

          const token = {
            phone,
            tokenId,
            expire,
          };

          create("tokens", tokenId, token, (err) => {
            if (!err) {
              callback(200, {
                message: "Token create successfully",
              });
            } else {
              callback(500, {
                error: "internal server error",
              });
            }
          });
        } else {
          callback(400, {
            error: "wrong password!!!",
          });
        }
      } else {
        callback(500, {
          error: "user not found",
        });
      }
    });
  } else {
    callback(400, {
      error: "Bad request",
    });
  }
};

handler._token.put = (requestedParamaeters, callback) => {
  const reqUserData = { ...requestedParamaeters.body };
  reqUserData.password = convertStrToHash(reqUserData.password);

  const phone =
    typeof reqUserData?.phone === "string" &&
    reqUserData?.phone?.trim().length === 11
      ? reqUserData?.phone
      : "";

  console.log(reqUserData);

  if (phone) {
    read("users", phone, (readErr, existingUser) => {
      if (!readErr && existingUser) {
        const updatedUser = { ...existingUser };

        updatedUser.firstName =
          reqUserData?.firstName && reqUserData?.firstName;

        updatedUser.lastName = reqUserData?.lastName && reqUserData?.lastName;

        updatedUser.password = reqUserData?.password && reqUserData?.password;

        update("users", phone, updatedUser, (err) => {
          if (!err) {
            callback(200, {
              message: "successfully updated",
            });
          } else {
            callback(500, {
              message: err,
            });
          }
        });
      } else {
        callback(500, {
          error: readErr,
        });
      }
    });
  } else {
    callback(400, {
      error: "Bad request",
    });
  }
};

handler._token.delete = (requestedParamaeters, callback) => {
  const reqQuery = { ...requestedParamaeters.query };

  const phone =
    typeof reqQuery?.phone === "string" && reqQuery?.phone?.trim().length === 11
      ? reqQuery?.phone
      : "";

  if (phone) {
    remove("users", phone, (err) => {
      if (!err) {
        callback(200, {
          message: "file deleted successfully",
        });
      } else {
        callback(500, {
          message: err,
        });
      }
    });
  } else {
    callback(400, {
      error: "User doesn't exist!!!",
    });
  }
};

// module exports

module.exports = handler;
