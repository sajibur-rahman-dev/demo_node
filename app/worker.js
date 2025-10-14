/**
 *
 * Title : Uptime monitoring system
 * Description : This is simple api app , that monitor a link Up or Down
 * Author : Sajibur Rahman
 * Date : 19 sept., 2025
 *
 */

// dependencies :

const { readFolder, read, update } = require("../lib/data");
const url = require("url");
const http = require("http");
const https = require("https");
const { sendNotification } = require("../helpers/notification");

// app scaffolding :

const worker = {};

// gether the monitoredUrl files

worker.getherAllMonitoredUrlsFiles = () => {
  readFolder("monitoredUrls", (err, fileNames) => {
    if (!err && fileNames && fileNames.length > 0) {
      fileNames.forEach((fileName) => {
        read("monitoredUrls", fileName, (err, monitoredUrlData) => {
          worker.validatedMonitoredUrl(monitoredUrlData);
        });
      });
    } else {
      console.log("no monitoredUrl found!!!");
    }
  });
};

// validated the url
worker.validatedMonitoredUrl = (monitoredUrlData) => {
  const updatedMonitoredUrl = { ...monitoredUrlData };
  if (updatedMonitoredUrl.monitoredUrlId) {
    updatedMonitoredUrl.state =
      typeof updatedMonitoredUrl.state === "string" &&
      ["up", "down"].indexOf(updatedMonitoredUrl.state) > -1
        ? updatedMonitoredUrl.state
        : "down";

    updatedMonitoredUrl.lastChecked =
      typeof updatedMonitoredUrl.lastChecked === "number" &&
      updatedMonitoredUrl.lastChecked > 0
        ? updatedMonitoredUrl.lastChecked
        : false;

    worker.performCheck(updatedMonitoredUrl);
  } else {
    console.log("monitored URl not valid");
  }
};

worker.performCheck = (updatedMonitoredUrl) => {
  let checkOutCome = {
    error: false,
    responseCode: false,
  };

  let outcomeSent = false;

  const paredUrl = url.parse(
    `${updatedMonitoredUrl.protocol}://${updatedMonitoredUrl.url}`,
    true
  );

  const hostname = paredUrl.hostname;
  const path = paredUrl.path;

  const option = {
    protocol: `${updatedMonitoredUrl.protocol}:`,
    hostname,
    method: updatedMonitoredUrl.method.toUpperCase(),
    path,
    timeout: updatedMonitoredUrl.waitingTime * 1000,
  };

  const protocolToUse = updatedMonitoredUrl.protocol === "http" ? http : https;

  const req = protocolToUse.request(option, (res) => {
    const status = res.statusCode;
    checkOutCome.responseCode = status;
    if (!outcomeSent) {
      worker.processCheckOutCome(updatedMonitoredUrl, checkOutCome);
      outcomeSent = true;
    }
  });

  req.on("error", (e) => {
    checkOutCome = {
      error: true,
      value: e,
    };

    if (!outcomeSent) {
      worker.processCheckOutCome(updatedMonitoredUrl, checkOutCome);
      outcomeSent = true;
    }
  });

  req.on("timeout", () => {
    checkOutCome = {
      error: true,
      value: "timeout",
    };
    if (!outcomeSent) {
      worker.processCheckOutCome(updatedMonitoredUrl, checkOutCome);
      outcomeSent = true;
    }
  });

  req.end();
};

worker.processCheckOutCome = (updatedMonitoredUrl, checkOutCome) => {
  const newUpdatedMonitoredUrl = { ...updatedMonitoredUrl };

  const state =
    !checkOutCome.error &&
    checkOutCome.responseCode &&
    newUpdatedMonitoredUrl.successCodes.indexOf(checkOutCome.responseCode) > -1
      ? "up"
      : "down";

  const alertWanted = !!(newUpdatedMonitoredUrl.state !== state);

  newUpdatedMonitoredUrl.state = state;
  newUpdatedMonitoredUrl.lastChecked = Date.now();

  update(
    "monitoredUrls",
    newUpdatedMonitoredUrl.monitoredUrlId,
    newUpdatedMonitoredUrl,
    (err) => {
      if (!err) {
        if (alertWanted) {
          worker.alertUserToStatusChange(newUpdatedMonitoredUrl);
        }
      } else {
        console.log("udate error");
      }
    }
  );
};

worker.alertUserToStatusChange = (newUpdatedMonitoredUrl) => {
  const msg = `Alert : your check for ${newUpdatedMonitoredUrl.method.toUpperCase()} ${
    newUpdatedMonitoredUrl.protocol
  }://${newUpdatedMonitoredUrl.url} is currently ${
    newUpdatedMonitoredUrl.state
  }`;

  sendNotification(newUpdatedMonitoredUrl.lastChecked, msg, (err) => {
    if (!err) {
      console.log(`user was notified via SMS :${msg}`);
    } else {
      console.log("there was a problem");
    }
  });
};

// loop the gether monitoredUrl function :

worker.loop = () => {
  setInterval(() => {
    worker.getherAllMonitoredUrlsFiles();
  }, 1000 * 60);
};

// server start :

worker.init = () => {
  worker.getherAllMonitoredUrlsFiles();

  worker.loop();
};

// exports server module

module.exports = worker;
