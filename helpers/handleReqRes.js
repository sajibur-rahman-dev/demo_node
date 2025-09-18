/**
 *
 * Title : Handle req and res
 * Description : Handler function for req and res
 * Author : Sajibur Rahman
 * Date : 19 sept., 2025
 *
 */

// dependencies :

const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const {
  notFoundRouteHandler,
} = require("../handlers/routesHandlers/notFoundHandler");

// handler scaffolding

const handler = {};

// handler config

const decoder = new StringDecoder("utf-8");

// req and res handler functiond

handler.handleReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname.replace(/^\/+|\/+$/g, "");
  const query = parsedUrl.query;
  const method = req.method.toLowerCase();
  const headers = req.headers;

  const requestedParamaeters = {
    parsedUrl,
    pathname,
    query,
    method,
    headers,
  };

  const requestedRouteHandler = routes[pathname]
    ? routes[pathname]
    : notFoundRouteHandler;

  let reqData = "";

  req.on("data", (buffer) => {
    reqData += decoder.write(buffer);
  });

  req.on("end", () => {
    requestedRouteHandler(requestedParamaeters, (statusCode, payload) => {
      const respondedStatusCode =
        typeof statusCode === "number" ? statusCode : 500;
      const respondedPayload = typeof payload === "object" ? payload : {};

      res.writeHead(respondedStatusCode);
      res.end(JSON.stringify(respondedPayload));
    });
  });
};

// handler module exports

module.exports = handler;
