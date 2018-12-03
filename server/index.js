const startTime = new Date();

console.log(`loading...`);

const express = require("express");
console.log(
  `loaded require for express (${new Date().getTime() -
    startTime.getTime()} ms)`
);

const excersize = require("./excersize/controller");
console.log(
  `loaded require for controller (${new Date().getTime() -
    startTime.getTime()} ms)`
);

const expressValidator = require("express-validator");
console.log(
  `loaded require for express-validator (${new Date().getTime() -
    startTime.getTime()} ms)`
);

const app = express();

console.log(
  `loaded express (${new Date().getTime() - startTime.getTime()} ms)`
);

const port = 80; // 80 is HTTP's default
const server = "localhost";

app.set("view engine", "ejs");
console.log(
  `set view engine to ejs (${new Date().getTime() - startTime.getTime()} ms)`
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
console.log(
  `added header policy (fixing cors) (${new Date().getTime() -
    startTime.getTime()} ms)`
);

app.use(express.json());
console.log(
  `loaded express json parser (${new Date().getTime() -
    startTime.getTime()} ms)`
);

app.use(express.urlencoded({ extended: true }));
console.log(
  `loaded express urlencoded parser (${new Date().getTime() -
    startTime.getTime()} ms)`
);

app.use(expressValidator());
console.log(
  `loaded expressValidator (${new Date().getTime() - startTime.getTime()} ms)`
);

app.use("/static", express.static("static"));
console.log(
  `loaded static content function (${new Date().getTime() -
    startTime.getTime()} ms)`
);

app.use(excersize);
console.log(
  `loaded excersize controller (${new Date().getTime() -
    startTime.getTime()} ms)`
);

app.use(function(req, res, next) {
  console.log("failed to get url: " + req.originalUrl);
  res.status(404).render("404");
});
console.log(
  `loaded 404 handler (${new Date().getTime() - startTime.getTime()} ms)`
);

app.use(function(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  console.error("ERROR! " + err.stack);
  res.status(500).render("500");
});
console.log(
  `loaded 500 handler (${new Date().getTime() - startTime.getTime()} ms)`
);

app.listen(port);

const endTime = new Date();

console.log(
  `listening on: http://${server}:${port} (${endTime.getTime() -
    startTime.getTime()} ms)`
);
