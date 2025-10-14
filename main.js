/**
 *
 * Title : Uptime monitoring system
 * Description : This is simple api app , that monitor a link Up or Down
 * Author : Sajibur Rahman
 * Date : 19 sept., 2025
 *
 */

// dependencies :

const server = require("./app/server");
const worker = require("./app/worker");

// app scaffolding :

const app = {};

// handle req res :

app.init = () => {
  // server init
  server.init();
  // worker init
  worker.init();
};

app.init();

module.exports = app;
