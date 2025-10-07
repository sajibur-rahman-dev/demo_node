/**
 *
 * Title :User route handlers
 * Description : Handle user related route
 * Author : Sajibur Rahman
 * Date : 23 sept., 2025
 *
 */

// dependencies;

const crypto = require("crypto");
const { convertStrToHash } = require("../../helpers/utlis");
const { read, create, update, remove } = require("../../lib/data");
const tokenVerifyHandler = require("./tokenRouterHandler");

// handler - module scaffolding

const handler = {};

handler.allowedMethods = ["get", "post", "put", "delete"];

// about handler
handler.userRouteHandler = (requestedParamaeters, callback) => {
  if (handler.allowedMethods.includes(requestedParamaeters.method)) {
    handler._user[requestedParamaeters.method](requestedParamaeters, callback);
  } else {
    callback(405);
  }
};

handler._user = {};

// method handler

handler._user.post = (requestedParamaeters, callback) => {
  const userData = { ...requestedParamaeters.body };

  const firstName =
    typeof userData?.firstName === "string" &&
    userData?.firstName?.trim().length > 0
      ? userData?.firstName
      : "";

  const lastName =
    typeof userData?.lastName === "string" &&
    userData?.lastName?.trim().length > 0
      ? userData?.lastName
      : "";

  const phone =
    typeof userData?.phone === "string" && userData?.phone?.trim().length === 11
      ? userData?.phone
      : "";

  const password =
    typeof userData?.password === "string" &&
    userData?.password?.trim().length > 0
      ? convertStrToHash(userData?.password)
      : "";

  userData.password = password;

  if (firstName && lastName && phone && password) {
    create("users", phone, userData, (err) => {
      if (!err) {
        callback(200, {
          message: "successfully created",
        });
      } else {
        callback(500, {
          message: "user already exist",
        });
      }
    });
  } else {
    callback(400, {
      error: "Bad request",
    });
  }
};

handler._user.get = (requestedParamaeters, callback) => {
  const reqUserQuery = { ...requestedParamaeters.query };
  const reqUserHeaders = { ...requestedParamaeters.headers };

  const phone =
    typeof reqUserQuery.phone === "string" &&
    reqUserQuery.phone.trim().length === 11
      ? reqUserQuery.phone
      : "";

  const token =
    typeof reqUserHeaders.token === "string" ? reqUserHeaders.token : "";

  if (phone) {
    tokenVerifyHandler._token.verify(token, phone, (tokenVerified) => {
      if (tokenVerified) {
        read("users", phone, (err, data) => {
          const user = { ...data };

          delete user.password;

          if (!err && data) {
            callback(200, user);
          } else {
            callback(500, {
              message: "user not found",
            });
          }
        });
      } else {
        callback(403, {
          error: "Unauthorize User!!!",
        });
      }
    });
  } else {
    callback(400, {
      error: "Bad request!!!",
    });
  }
};

handler._user.put = (requestedParamaeters, callback) => {
  const reqUserData = { ...requestedParamaeters.body };
  const reqUserQuery = { ...requestedParamaeters.query };
  const reqUserHeaders = { ...requestedParamaeters.headers };

  const phone =
    typeof reqUserQuery?.phone === "string" &&
    reqUserQuery?.phone?.trim().length === 11
      ? reqUserQuery?.phone
      : "";

  const token =
    typeof reqUserHeaders.token === "string" ? reqUserHeaders.token : "";

  console.log(reqUserData);

  if (phone) {
    tokenVerifyHandler._token.verify(token, phone, (tokenVerified) => {
      if (tokenVerified) {
        read("users", phone, (readErr, existingUser) => {
          if (!readErr && existingUser) {
            const updatedUser = { ...existingUser };

            updatedUser.firstName =
              reqUserData?.firstName && reqUserData?.firstName;

            updatedUser.lastName =
              reqUserData?.lastName && reqUserData?.lastName;

            updatedUser.password =
              reqUserData?.password && convertStrToHash(reqUserData?.password);

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
        callback(403, {
          error: "Unauthorize User!!!",
        });
      }
    });
  } else {
    callback(400, {
      error: "Bad request",
    });
  }
};

handler._user.delete = (requestedParamaeters, callback) => {
  const reqQuery = { ...requestedParamaeters.query };
  const reqUserHeaders = { ...requestedParamaeters.headers };

  const phone =
    typeof reqQuery?.phone === "string" && reqQuery?.phone?.trim().length === 11
      ? reqQuery?.phone
      : "";

  const token =
    typeof reqUserHeaders.token === "string" ? reqUserHeaders.token : "";

  if (phone) {
    tokenVerifyHandler._token.verify(token, phone, (tokenVerified) => {
      if (tokenVerified) {
        remove("users", phone, (err) => {
          if (!err) {
            callback(200, {
              message: "user deleted successfully",
            });
          } else {
            callback(500, {
              message: err,
            });
          }
        });
      } else {
        callback(403, {
          error: "Unauthorize User!!!",
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
