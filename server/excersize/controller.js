const express = require("express");
const { User } = require("./model");
const mongo = require("mongodb").MongoClient;
const sha512 = require("js-sha512");

let port = 27017;
let host = "localhost";
let db_name = "excersize-db";
let url = `mongodb://${host}:${port}/${db_name}`;

mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    console.log("database created");
    var dbo = db.db("excersize-db");
    dbo.createCollection("users", function (err, res) {
        if (err) throw err;
        console.log("created users collection");
        db.close();
    });
});

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res, next) {
    res.render("index");
});

app.post("/login", function (req, res, next) {
    console.log("login function executed");
    mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        db.db("excersize-db").collection("users").find({ name: req.body.name }).toArray(function (err, results) {
            var loggedIn = false;
            for (var result in results) {
                if (err) throw err;
                if (sha512.sha512(req.body.password) === results[result].password) {
                    // login();
                    res.send("logged in as " + results[result].name);
                    loggedIn = true;
                }
            }
            if (!loggedIn) {
                res.send("failed to log in");
            }
        });
        db.close();
    });
});

app.post("/sign-up", function (req, res, next) {
    console.log("sign-up function executed");
    var name = req.body.name;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var password = req.body.password;
    if (name !== "" && name != undefined && name != null && firstName !== "" &&
        firstName != undefined && firstName != null && lastName !== "" &&
        lastName != undefined && lastName != null && password !== "" &&
        password != undefined && password != null) {
        var newUser = new User();
        newUser.generate(name, firstName, lastName, password);
        mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var foundUser = false;
            db.db("excersize-db").collection("users").find({ name: newUser.name }).toArray(function (err, results) {
                if (err) throw err;
                for (var result in results) {
                    console.log("result name: " + results[result].name + "; new name: " + newUser.name);
                    if (results[result].name === newUser.name) {
                        foundUser = true;
                    }
                }
                // if statement has to be in here because database lookups are synchronous to server-side js
                if (foundUser == false) {
                    db.db("excersize-db").collection("users").insertOne(newUser);
                    res.send("New user created.");
                } else {
                    res.send("Please pick a different username.");
                }
            });
        });
    } else {
        res.send("Error: check to see if you entered in your username, first name, last name, and a password.");
    }
});

app.post("/step", function (req, res, next) {
    // ideally: this is going to be requested through AJAX whenever the user takes a step
    mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        db.db("excersize-db").collection("users").findOne({ name: req.body.name }, function (err, result) {
            var user = (new User()).genUserFromObject(result);
            user.step();
            db.db("excersize-db").collection("users").updateOne(
                { name: user.name },
                { $set: { steps: user.steps } },
                function (err, result) {
                    if (err) throw err;
                    console.log(user.name + " took a step");
                    res.send("updated");
                }
            );
        });
    });
});

module.exports = app;