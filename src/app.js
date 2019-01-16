const fs = require("fs");

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

const app = function (req, res) {
  const errorMessage = "Invalid request";
  let filePath = "." + req.url;


  if (req.url === "/") {
    filePath = "." + req.url + "src/home_page.html";
  }

  fs.readFile(filePath, function (error, data) {
    if (!error) {
      sendData(req, res, data);
      return;
    }
    throwError(req, res, errorMessage);
  });
};

// Export a function that can act as a handler

module.exports = app;
