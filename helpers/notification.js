/**
 *
 * Title : Handle monitoring notification !!!
 * Description : Handler function for monitoring notification !!!
 * Author : Sajibur Rahman!!!
 * Date : 13 oct., 2025!!!
 *
 */

// dependencies :
const { create } = require("../lib/data");

// handler scaffolding

const notification = {};

notification.sendNotification = (phone, message, callback) => {
  const newNotification = {
    id: phone,
    message,
  };
  create("notifications", phone, newNotification, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

// handler module exports

module.exports = notification;
