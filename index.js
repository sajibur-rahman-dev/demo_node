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
const { handleReqRes } = require("./helpers/handleReqRes");
const { create } = require("./lib/data");

// app scaffolding :

const app = {};

// handle req res :

app.handleReqRes = handleReqRes;
// server create :

app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(process.env.PORT, () => {
    console.log(`Server is running ${process.env.PORT}`);
  });
};

// server start

app.createServer();
