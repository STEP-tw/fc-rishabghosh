const fs = require("fs");

const app = function (req, res) {
  let path = "." + req.url;

  console.log("url is", req.url);

  if(req.url === "/"){
    path = "." + req.url + "src/index.html";
  }
  console.log("path is", path);

  fs.readFile(path, function (error, data) {
    if (error) {
      res.statusCode = 404;
      res.write("invalid request");
      res.end();
    } else {
      console.log("trting to read file");
      res.write(data);
      console.log("url after reading", req.url);
      console.log("path after reading", path);
      console.log("ending after reading");
      res.end();
    }
  });
};

// Export a function that can act as a handler

module.exports = app;
