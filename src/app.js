const fs = require("fs");

const WebFramework = require("./handler.js");

const {
  ERROR_MESSAGE,
  DEFAULT_FILE_PATH,
  COMMENT_FILE_PATH,
  GUEST_BOOK_FILE_PATH,
  UTF8,
  EQUAL_TO,
  AND,
  EMPTY_STRING
} = require("./constants.js");


const getInitialComments = function () {
  const initialComments = fs.readFileSync(COMMENT_FILE_PATH, UTF8);
  return JSON.parse(initialComments);
};

let INITIAL_COMMENTS = getInitialComments();


const sendData = function (req, res, data) {
  res.statusCode = 200;
  res.write(data);
  res.end();
};

const throwError = function (req, res, errorMessage) {
  res.statusCode = 404;
  res.write(ERROR_MESSAGE);
  res.end();
};

const parser = function (text) {
  const eachPair = text.split(AND); //each key-val pair
  const args = {};
  eachPair.forEach(keyValue => {
    const parts = keyValue.split(EQUAL_TO);
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
    throwError(req, res, ERROR_MESSAGE);
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

const guestBook = function () {
  return fs.readFileSync(GUEST_BOOK_FILE_PATH, UTF8);
};

const generateCommentTable = function (comment) {
  let table = "<table id='comment'>";
  let tr = comment.map(comment => {
    return `<tr><td>${comment.name}</td><td>${comment.comment}</td></tr>`;
  });
  return table + tr.join("") + "</table>";
};



const readBody = function (req, res) {
  let content = EMPTY_STRING;
  res.statusCode = 200;
  req.on("data", (chunk) => content += chunk);
  req.on("end", () => {

    const parsedArgs = parser(content);
    INITIAL_COMMENTS.push(parsedArgs);

    fs.writeFile(COMMENT_FILE_PATH, JSON.stringify(INITIAL_COMMENTS),
      function (error) {
        if (error) { console.error(error); return; }
        const table = generateCommentTable(INITIAL_COMMENTS);

        const message = guestBook().replace(
          "<div id=\"comments\"></div>",
          `<div id="comments">${table}</div>`
        );
        res.write(message);
        res.end();
      });
  });
};

const renderGuestBook = function (req, res) {
  fs.readFile(COMMENT_FILE_PATH, function (error, data) {
    if (error) { throwError(req, res, ERROR_MESSAGE); return; }
    const commentData = JSON.parse(data);

    fs.readFile(GUEST_BOOK_FILE_PATH, function (error, data) {
      if (error) { throwError(req, res, ERROR_MESSAGE); return; }
      const htmlData = data;
      const totalData = htmlData + generateCommentTable(commentData);

      sendData(req, res, totalData);
    });
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
  webFramework.get("/guest_book.html", renderGuestBook);
  webFramework.get("/style/guest_book.css", serveFiles);
  webFramework.get("/javascript/guestBook.js", serveFiles);

  webFramework.post("/guest_book.html", readBody);
  webFramework.error(throwError);
  webFramework.handleRequest(req, res);
};

// Export a function that can act as a handler

module.exports = app;
