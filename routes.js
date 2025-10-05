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
  aboutRouteHandler,
} = require("./handlers/routesHandlers/aboutRouteHandler");

const {
  userRouteHandler,
} = require("./handlers/routesHandlers/userRouteHandler");

const {
  notFoundRouteHandler,
} = require("./handlers/routesHandlers/notFoundHandler");

// routes -  module scaffolding

const routes = {
  about: aboutRouteHandler,
  user: userRouteHandler,
};

// module exports

module.exports = routes;
