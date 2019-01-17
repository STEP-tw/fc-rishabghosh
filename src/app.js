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

const parser = function (text) {
  const eachPair = text.split("&"); //each key-val pair
  const args = {};
  eachPair.forEach(keyValue => {
    const parts = keyValue.split("=");
    const key = parts[0];
    const value = parts[1];
    args[key] = value;
  });
  return args;
};

const afterAppending = function (error) {
  if (error) { throw error; }
  console.log("Saved");
};

const readBody = function (req, res) {
  let content = "";
  req.on("data", (chunk) => { content += chunk; });
  req.on("end", () => {
    const comments = JSON.stringify(parser(content));
    fs.appendFileSync("./public/comments.txt", comments, afterAppending);
  });
};



const app = function (req, res) {
  const errorMessage = "Invalid request";
  const defaultFilePath = "./public/index.html";
  let filePath = "./public" + req.url;

  if (req.url === "/") {
    filePath = defaultFilePath;
  }
  readBody(req, res);

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
