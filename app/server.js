/**
 *
 * Title : Uptime monitoring system
 * Description : This is simple api app , that monitor a link Up or Down
 * Author : Sajibur Rahman
 * Date : 19 sept., 2025
 *
 */

// dependencies :

const http = require("http");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const { handleReqRes } = require("../helpers/handleReqRes");

// app scaffolding :

const server = {};

// handle req res :

server.PORT = process.env.PORT || 8080;

server.handleReqRes = handleReqRes;
// server create :

server.createServer = () => {
  const createdServer = http.createServer(server.handleReqRes);
  createdServer.listen(process.env.PORT, () => {
    console.log(
      `Server is running ${process.env.PORT}, http://localhost:${server.PORT}`
    );
  });
};

// server start

server.init = () => {
  server.createServer();
};

// exports server module

module.exports = server;
