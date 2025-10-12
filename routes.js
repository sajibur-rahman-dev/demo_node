/**
 *
 * Title : Applications Routes
 * Description : Defined application's routes
 * Author : Sajibur Rahman
 * Date : 19 sept., 2025
 *
 */

// dependencies :

const {
  userRouteHandler,
} = require("./handlers/routesHandlers/userRouteHandler");

const {
  notFoundRouteHandler,
} = require("./handlers/routesHandlers/notFoundHandler");

const {
  tokenRouteHandler,
} = require("./handlers/routesHandlers/tokenRouterHandler");

const {
  monitoredUrlRouteHandler,
} = require("./handlers/routesHandlers/monitoredUrlRouteHandler");

// routes -  module scaffolding

const routes = {
  user: userRouteHandler,
  token: tokenRouteHandler,
  monitoredUrl: monitoredUrlRouteHandler,
};

// module exports

module.exports = routes;
