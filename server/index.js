const express = require('express');

console.log("loading...");

const app = express();

const port = 80; // 80 is HTTP's default
const server = "localhost";

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get("/", function(req, res, next) {
    res.render("index");
});

app.listen(port);

console.log(`listening on: http://${server}:${port}`);