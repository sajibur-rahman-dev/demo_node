/**
 *
 * Title :Not found handlers
 * Description : Handle not found related route
 * Author : Sajibur Rahman
 * Date : 19 sept., 2025
 *
 */

// dependencies;

// handler - module scaffolding

const handler = {};

// about handler
handler.notFoundRouteHandler = (requestedParamaeters, callback) => {
  callback(404, {
    message: "not found route",
  });
};

// module exports

module.exports = handler;
