const fs = require("fs");

const WebFramework = require("./handler.js");

const {
  ERROR_MESSAGE,
  DEFAULT_FILE_PATH,
} = require("./constants.js");

const sendData = function (req, res, data) {
  res.statusCode = 200;
  res.write(data);
  res.end();
};

const throwError = function (req, res, errorMessage) {
  res.statusCode = 404;
  res.write(errorMessage);
  res.end();
};

const parser = function (text) {
  const eachPair = text.split("&"); //each key-val pair
  const args = {};
  eachPair.forEach(keyValue => {
    const parts = keyValue.split("=");
    const key = parts[0];
    const value = parts[1];
    if (key && value) args[key] = value;
  });
  return args;
};

//should be in util
const getFilePath = function (url) {
  let filePath = "./public" + url;
  if (url === "/") { filePath = DEFAULT_FILE_PATH; }
  return filePath;
};

const serveFile = function (req, res) {
  const filePath = getFilePath(req.url);
  fs.readFile(filePath, function (error, data) {
    if (!error) {
      sendData(req, res, data);
      return;
    }
    throwError(req, res, ERROR_MESSAGE);
  });
};

const app = function (req, res) {
  serveFile(req, res);
};

// Export a function that can act as a handler

module.exports = app;
