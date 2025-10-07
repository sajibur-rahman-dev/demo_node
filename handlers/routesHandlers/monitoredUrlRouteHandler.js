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
  callback(200, {
    message: "success",
  });
};

handler._monitoredUrl.get = (requestedParamaeters, callback) => {};

handler._monitoredUrl.put = (requestedParamaeters, callback) => {};

handler._monitoredUrl.delete = (requestedParamaeters, callback) => {};

// module exports

module.exports = handler;
