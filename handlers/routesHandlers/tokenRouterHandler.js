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
                data: token,
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
  const reqTokenData = { ...requestedParamaeters.body };

  const tokenId =
    typeof reqTokenData?.tokenId === "string" &&
    reqTokenData?.tokenId?.trim().length === 20
      ? reqTokenData?.tokenId
      : "";

  const extend = !!(
    typeof reqTokenData?.extend === "boolean" && reqTokenData?.extend === true
  );

  if (tokenId && extend) {
    read("tokens", tokenId, (readErr, existingToken) => {
      if (!readErr && existingToken) {
        const updatedToken = { ...existingToken };

        if (updatedToken.expire > Date.now()) {
          updatedToken.expire = Date.now() + 60 * 60 * 1000;

          update("tokens", tokenId, updatedToken, (err) => {
            if (!err) {
              callback(200, {
                message: "successfully extend token expires date",
                data: updatedToken,
              });
            } else {
              callback(500, {
                message: "token updated failed",
              });
            }
          });
        } else {
          callback(500, {
            error: "token already expired",
          });
        }
      } else {
        callback(500, {
          error: "Token not found",
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
  const reqTokenQuery = { ...requestedParamaeters.query };

  const tokenId =
    typeof reqTokenQuery?.tokenId === "string" &&
    reqTokenQuery?.tokenId?.trim().length === 20
      ? reqTokenQuery?.tokenId
      : "";

  if (tokenId) {
    remove("tokens", tokenId, (err) => {
      if (!err) {
        callback(200, {
          message: "token deleted successfully",
        });
      } else {
        callback(500, {
          message: "Token doesn't exist!!!",
        });
      }
    });
  } else {
    callback(400, {
      error: "Bad request",
    });
  }
};

handler._token.verify = (tokenId, phone, callback) => {
  read("tokens", tokenId, (err, tokenData) => {
    console.log(tokenData);
    if (!err && tokenData) {
      if (tokenData.phone === phone && tokenData.expire > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};
// module exports

module.exports = handler;
