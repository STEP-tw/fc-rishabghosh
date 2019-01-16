const app = function (req, res) {
  res.statusCode = 200;
  console.log("one req came");
  res.write("hi welcome to my page");
  res.end();
};

// Export a function that can act as a handler

module.exports = app;
