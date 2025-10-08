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
const { convertStrToHash, generateRandomStr } = require("../../helpers/utlis");
const { read, create, update, remove } = require("../../lib/data");
const tokenVerifyHandler = require("./tokenRouterHandler");

// handler - module scaffolding

const handler = {};

handler.allowedMethods = ["get", "post", "put", "delete"];

// about handler
handler.monitoredUrlRouteHandler = (requestedParamaeters, callback) => {
  if (handler.allowedMethods.includes(requestedParamaeters.method)) {
    handler._monitoredUrl[requestedParamaeters.method](
      requestedParamaeters,
      callback
    );
  } else {
    callback(405);
  }
};

handler._monitoredUrl = {};

// method handler

handler._monitoredUrl.post = (requestedParamaeters, callback) => {
  const reqMonitoredUrlData = { ...requestedParamaeters.body };
  const reqMonitoredUrlHeaders = { ...requestedParamaeters.headers };

  const protocol =
    typeof reqMonitoredUrlData.protocol === "string" &&
    ["http", "https"].indexOf(reqMonitoredUrlData.protocol) > -1
      ? reqMonitoredUrlData.protocol
      : "";

  const url =
    typeof reqMonitoredUrlData.url === "string" &&
    reqMonitoredUrlData.url.trim().length > 0
      ? reqMonitoredUrlData.url
      : "";

  const method =
    typeof reqMonitoredUrlData.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(reqMonitoredUrlData.method) > -1
      ? reqMonitoredUrlData.method
      : "";

  const successCodes =
    typeof reqMonitoredUrlData.successCodes === "object" &&
    reqMonitoredUrlData.successCodes instanceof Array
      ? reqMonitoredUrlData.successCodes
      : "";

  const waitingTime =
    typeof reqMonitoredUrlData.waitingTime === "number" &&
    reqMonitoredUrlData.waitingTime % 1 === 0 &&
    reqMonitoredUrlData.waitingTime >= 1 &&
    reqMonitoredUrlData.waitingTime <= 5
      ? reqMonitoredUrlData.waitingTime
      : "";

  const token =
    typeof reqMonitoredUrlHeaders.token === "string"
      ? reqMonitoredUrlHeaders.token
      : "";

  if (protocol && url && method && successCodes && waitingTime) {
    read("tokens", token, (err, tokenData) => {
      if (!err) {
        const userPhone = tokenData.phone;
        read("users", userPhone, (err, userData) => {
          if (!err && userData) {
            const updatedUserData = { ...userData };
            tokenVerifyHandler._token.verify(
              token,
              userPhone,
              (tokenIsValid) => {
                if (tokenIsValid) {
                  const userMonitoredUrls =
                    typeof updatedUserData.userMonitoredUrls === "object" &&
                    updatedUserData.userMonitoredUrls instanceof Array
                      ? updatedUserData.userMonitoredUrls
                      : [];

                  if (userMonitoredUrls.length < 5) {
                    const monitoredUrlId = generateRandomStr(20);
                    const monitoredUrlData = {
                      monitoredUrlId,
                      userPhone,
                      protocol,
                      url,
                      method,
                      successCodes,
                      waitingTime,
                    };

                    create(
                      "monitoredUrls",
                      monitoredUrlId,
                      monitoredUrlData,
                      (err) => {
                        if (!err) {
                          updatedUserData.userMonitoredUrls = userMonitoredUrls;

                          updatedUserData.userMonitoredUrls.push(
                            monitoredUrlId
                          );

                          update("users", userPhone, updatedUserData, (err) => {
                            if (!err) {
                              callback(200, {
                                message: "monitored url add successful",
                              });
                            } else {
                              callback(500, {
                                error: "internal server error",
                              });
                            }
                          });
                        } else {
                          callback(500, {
                            error: "monitor url already exist",
                          });
                        }
                      }
                    );
                  } else {
                    callback(500, {
                      error: "limit the url monitoring!!!",
                    });
                  }
                } else {
                  callback(401, {
                    error: "Unauthorize",
                  });
                }
              }
            );
          } else {
            callback(403, {
              error: "user not found",
            });
          }
        });
      } else {
        callback(401, {
          error: "Unauthorize",
        });
      }
    });
  } else {
    callback(400, {
      message: "Bad request",
    });
  }
};

handler._monitoredUrl.get = (requestedParamaeters, callback) => {
  const reqMonitoredUrlQuery = { ...requestedParamaeters.query };
  const reqMonitoredUrlHeaders = { ...requestedParamaeters.headers };

  const id =
    typeof reqMonitoredUrlQuery.id === "string" &&
    reqMonitoredUrlQuery.id.trim().length > 0
      ? reqMonitoredUrlQuery.id
      : "";

  const token =
    typeof reqMonitoredUrlHeaders.token === "string" &&
    reqMonitoredUrlHeaders.token.trim().length > 0
      ? reqMonitoredUrlHeaders.token
      : "";

  if (id) {
    read("tokens", token, (err, tokenData) => {
      const userPhone = tokenData.phone;

      if (!err && tokenData) {
        tokenVerifyHandler._token.verify(token, userPhone, (tokenIsValid) => {
          if (tokenIsValid) {
            read("monitoredUrls", id, (err, monitoredUrlsData) => {
              if (!err && monitoredUrlsData) {
                callback(200, {
                  data: monitoredUrlsData,
                });
              } else {
                console.log(err);
                callback(404, {
                  error: "not found",
                });
              }
            });
          } else {
            callback(401, {
              error: "Unauthorize",
            });
          }
        });
      } else {
        callback(401, {
          error: "Unauthorize",
        });
      }
    });
  } else {
    callback(400, {
      error: "bad request",
    });
  }
};

handler._monitoredUrl.put = (requestedParamaeters, callback) => {
  const reqMonitoredUrlData = { ...requestedParamaeters.body };
  const reqMonitoredUrlQuery = { ...requestedParamaeters.query };
  const reqMonitoredUrlHeaders = { ...requestedParamaeters.headers };

  const id =
    typeof reqMonitoredUrlQuery.id === "string" &&
    reqMonitoredUrlQuery.id.trim().length > 0
      ? reqMonitoredUrlQuery.id
      : "";

  const protocol =
    typeof reqMonitoredUrlData.protocol === "string" &&
    ["http", "https"].indexOf(reqMonitoredUrlData.protocol) > -1
      ? reqMonitoredUrlData.protocol
      : false;

  const url =
    typeof reqMonitoredUrlData.url === "string" &&
    reqMonitoredUrlData.url.trim().length > 0
      ? reqMonitoredUrlData.url
      : false;

  const method =
    typeof reqMonitoredUrlData.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(reqMonitoredUrlData.method) > -1
      ? reqMonitoredUrlData.method
      : false;

  const successCodes =
    typeof reqMonitoredUrlData.successCodes === "object" &&
    reqMonitoredUrlData.successCodes instanceof Array
      ? reqMonitoredUrlData.successCodes
      : false;

  const waitingTime =
    typeof reqMonitoredUrlData.waitingTime === "number" &&
    reqMonitoredUrlData.waitingTime % 1 === 0 &&
    reqMonitoredUrlData.waitingTime >= 1 &&
    reqMonitoredUrlData.waitingTime <= 5
      ? reqMonitoredUrlData.waitingTime
      : false;

  const token =
    typeof reqMonitoredUrlHeaders.token === "string"
      ? reqMonitoredUrlHeaders.token
      : "";

  if (id) {
    if (protocol || method || successCodes || waitingTime || url) {
      read("monitoredUrls", id, (err, monitoredUrlData) => {
        const updatedMonitoredUrlData = { ...monitoredUrlData };
        const userPhone = updatedMonitoredUrlData.userPhone;

        if (!err && monitoredUrlData) {
          tokenVerifyHandler._token.verify(token, userPhone, (tokenIsValid) => {
            if (tokenIsValid) {
              if (protocol) {
                updatedMonitoredUrlData.protocol = protocol;
              }
              if (url) {
                updatedMonitoredUrlData.url = url;
              }

              if (method) {
                updatedMonitoredUrlData.method = method;
              }

              if (successCodes) {
                updatedMonitoredUrlData.successCodes = successCodes;
              }

              if (waitingTime) {
                updatedMonitoredUrlData.waitingTime = waitingTime;
              }

              update("monitoredUrls", id, updatedMonitoredUrlData, (err) => {
                if (!err) {
                  callback(200, {
                    message: "successfully updated!!!",
                    data: updatedMonitoredUrlData,
                  });
                } else {
                  callback(500, {
                    error: "internal server error",
                  });
                }
              });
            } else {
              callback(401, {
                error: "Unauthorize",
              });
            }
          });
        } else {
          callback(404, {
            error: "Monitored url info not found",
          });
        }
      });
    } else {
      callback(400, {
        error: "Provide atleast field",
      });
    }
  } else {
    callback(400, {
      error: "bad request",
    });
  }
};

handler._monitoredUrl.delete = (requestedParamaeters, callback) => {
  const reqMonitoredUrlQuery = { ...requestedParamaeters.query };
  const reqMonitoredUrlHeaders = { ...requestedParamaeters.headers };

  const id =
    typeof reqMonitoredUrlQuery.id === "string" &&
    reqMonitoredUrlQuery.id.trim().length > 0
      ? reqMonitoredUrlQuery.id
      : "";

  const token =
    typeof reqMonitoredUrlHeaders.token === "string"
      ? reqMonitoredUrlHeaders.token
      : "";

  if (id) {
    read("monitoredUrls", id, (err, monitoredUrlData) => {
      const updatedMonitoredUrlData = { ...monitoredUrlData };
      const userPhone = updatedMonitoredUrlData.userPhone;

      if (!err && monitoredUrlData) {
        tokenVerifyHandler._token.verify(token, userPhone, (tokenIsValid) => {
          if (tokenIsValid) {
            remove("monitoredUrls", id, (err) => {
              if (!err) {
                read("users", userPhone, (err, userData) => {
                  if (!err && userData) {
                    const updatedUserData = { ...userData };
                    if (
                      updatedUserData.userMonitoredUrls &&
                      updatedUserData.userMonitoredUrls.length > 0
                    ) {
                      updatedUserData.userMonitoredUrls =
                        updatedUserData.userMonitoredUrls.filter(
                          (itemId) => itemId !== id
                        );

                      update("users", userPhone, updatedUserData, (err) => {
                        if (!err) {
                          callback(200, {
                            message: "successfully deleted!!!",
                          });
                        } else {
                          callback(500, {
                            error: "internal server error!!!",
                          });
                        }
                      });
                    }
                  } else {
                    callback(403, {
                      error: "Forbidden",
                    });
                  }
                });
              } else {
                callback(500, {
                  error: "Internal server error!!!",
                });
              }
            });
          } else {
            callback(401, {
              error: "Unauthorize",
            });
          }
        });
      } else {
        callback(404, {
          error: "Monitored url info not found",
        });
      }
    });
  } else {
    callback(400, {
      error: "Bad request",
    });
  }
};

// module exports

module.exports = handler;
