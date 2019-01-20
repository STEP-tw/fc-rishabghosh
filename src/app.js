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
  res.write("invalid req");
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

const getFilePath = function (url) {
  let filePath = "./public" + url;
  if (url === "/") { filePath = DEFAULT_FILE_PATH; }
  return filePath;
};

const serveFiles = function (req, res) {
  const filePath = getFilePath(req.url);
  fs.readFile(filePath, function (error, data) {
    if (!error) {
      sendData(req, res, data);
      return;
    }
    throwError(req, res, "invalid req");
  });
};

const logRequest = function (req, res) {
  console.log("\n------ LOGS -------\n");
  console.log("requested method ->", req.method);
  console.log("requested url -> ", req.url);
  console.log("headers =>", JSON.stringify(req.headers, null, 2));
  //console.log("body ->", req.body);
  console.log("\n ------ END ------- \n");
};

const readBody = function(req, res){
  let content = "";
  res.statusCode = 200;
  req.on("data", (chunk) => content += chunk);
  req.on("end", () => {
    const parsedArgs = JSON.stringify(parser(content));
    const message = "data given is -> " + parsedArgs;
    res.write(message);
    res.end();
  });
};

const app = function (req, res) {
  const webFramework = new WebFramework();
  webFramework.use(logRequest);
  webFramework.get("/", serveFiles);
  webFramework.get("/style/landing_page.css", serveFiles);
  webFramework.get("/javascript/landingPage.js", serveFiles);
  webFramework.get("/images/freshorigins.jpg", serveFiles);
  webFramework.get("/images/animated-flower.gif", serveFiles);
  webFramework.get("/guest_book.html", serveFiles);
  webFramework.get("/style/guest_book.css", serveFiles);
  webFramework.get("/javascript/guestBook.js", serveFiles);
  webFramework.post("/guest_book.html", readBody);
  
  webFramework.error(throwError);
  webFramework.handleRequest(req, res);
};

// Export a function that can act as a handler

module.exports = app;
