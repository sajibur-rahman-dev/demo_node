/**
 *
 * Title :About route handlers
 * Description : Handle about related route
 * Author : Sajibur Rahman
 * Date : 19 sept., 2025
 *
 */

// dependencies;

// handler - module scaffolding

const handler = {};

// about handler
handler.aboutRouteHandler = (requestedParamaeters, callback) => {
  callback(200, {
    message: "This is about page",
  });
};

// module exports

module.exports = handler;
