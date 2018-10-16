const express = require("express");
const { User, Goal } = require("./model");
const mongo = require("mongodb").MongoClient;
const sha512 = require("js-sha512");
const { checkKeys } = require("../utils");

let db_port = 27017;
let db_host = "localhost";
let db_name = "excersize-db";
let url = `mongodb://${db_host}:${db_port}/${db_name}`;

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
    if (checkKeys(req.body, ["name", "password"])) {
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
    } else {
        res.send("please send a username and password");
    }
});

app.post("/sign-up", function (req, res, next) {
    console.log("sign-up function executed");
    if (checkKeys(req.body, ["name", "firstName", "lastName", "password"])) {
        var name = req.body.name;
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var password = req.body.password;
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
    if (checkKeys(req.body, ["name"])) {
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
    } else {
        res.send("name not provided");
    }
});

app.post("/set-info", function (req, res, next) {
    if (checkKeys(req.body, ["name", "height", "weight"])) {
        mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            db.db("excersize-db").collection("users").findOne({ name: req.body.name }, function (err, result) {
                if (err) throw err;
                var user = (new User()).genUserFromObject(result);
                user.height = req.body.height;
                user.weight = req.body.weight;
                db.db("excersize-db").collection("users").updateOne(
                    { name: user.name },
                    { $set: { height: user.height, weight: user.weight } },
                    function (err, result) {
                        if (err) throw err;
                        console.log(user.name + " updated info; height is " + user.height + "; weight is " + user.weight);
                        res.send("updated successfully");
                    }
                );
            });
        });
    } else {
        res.send("please include a name, height, and weight");
    }
});

app.post("/set-goal", function (req, res, next) {
    if (checkKeys(req.body, ["name, goalType, goalValue"])) {
        mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            db.db("excersize-db").collection("users").findOne({ name: req.body.name }, function (err, result) {
                if (err) throw err;
                var user = (new User()).genUserFromObject(result);
                user.goal = (new Goal()).createNewGoal(req.body.goalType, req.body.goalValue);
                db.db("excersize-db").collection("users").updateOne(
                    { name: user.name },
                    {
                        $set:
                        {
                            goal: {
                                goalType: user.goal.goalType,
                                goalValue: user.goal.goalValue,
                                progress: user.goal.goalProgress
                            }
                        }
                    },
                    function (err, result) {
                        if (err) throw err;
                        console.log(user.name + " updated goal:");
                        console.log(user.goal);
                        res.send("goal updated");
                    }
                );
            });
        });
    } else {
        res.send("Please send a name, a goal type, and a goal value.");
    }
});

app.post("/get-goal", function (req, res, next) {
    if (checkKeys(req.body, ["name"])) {
        mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            db.db("excersize-db").collection("users").findOne({ name: req.body.name }, function (err, result) {
                if (err) throw err;
                res.send(result.goal);
            });
        });
    } else {
        res.send("name required");
    }
});

app.post("/get-name", function (req, res, next) {
    if (checkKeys(req.body, ["name"])) {
        mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            db.db("excersize-db").collection("users").findOne({ name: req.body.name }, function (err, result) {
                if (err) throw err;
                res.send(result.firstName + " " + result.lastName);
            });
        });
    } else {
        res.send("username required");
    }
});

app.post("/get-first-name", function (req, res, next) {
    if (checkKeys(req.body, ["name"])) {
        mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            db.db("excersize-db").collection("users").findOne({ name: req.body.name }, function (err, result) {
                if (err) throw err;
                res.send(result.firstName);
            });
        });
    } else {
        res.send("username required");
    }
});

module.exports = app;