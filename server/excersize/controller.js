const express = require("express");
const { User, Goal } = require("./model");
const mongo = require("mongodb").MongoClient;
const sha512 = require("js-sha512");
const { checkKeys } = require("../utils");

/*
    This program makes the assumption that you're running a local MongoDB database.
    To change that, edit these variables:

    db_port: port number of the database (default: 27017)
    db_host: host name of the database (default: localhost)
    db_name: name of the database (default: excersize-db)
*/
let db_port = 27017;
let db_host = "localhost";
let db_name = "excersize-db";
let url = `mongodb://${db_host}:${db_port}/${db_name}`;

mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    console.log("database created");
    db.db("excersize-db").createCollection("users", function (err, res) {
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
                        res.send("true");
                        loggedIn = true;
                    }
                }
                if (!loggedIn) {
                    res.send("false");
                }
            });
            db.close();
        });
    } else {
        res.send("false");
    }
});

app.delete("/delete-user", function (req, res, next) {
    console.log("delete function executed");
    if (checkKeys(req.body, ["name", "password"])) {
        mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            db.db("excersize-db").collection("users").find({ name: req.body.name }).toArray(function (err, results) {
                var loggedIn = false;
                for (var result in results) {
                    if (err) throw err;
                    if (sha512.sha512(req.body.password) === results[result].password) {
                        db.db("excersize-db").collection("users").deleteOne({ name: req.body.name }, function (err, result) {
                            if (err) throw err;
                            if (result.deletedCount > 0) {
                                res.send("true");
                            } else {
                                res.send("false");
                            }
                            db.close();
                        });
                        loggedIn = true;
                    }
                }
                if (!loggedIn) {
                    res.send("false");
                }
            });
        });
    } else {
        res.send("false");
    }
});

app.put("/update-user-info", function (req, res, next) {
    if (checkKeys(req.body, ["oldName", "oldPassword", "newName", "newPassword", "newFirstName", "newLastName"])) {
        mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            db.db("excersize-db").collection("users").find({ name: req.body.oldName }).toArray(function (err, results) {
                var loggedIn = false;
                for (var result in results) {
                    if (err) throw err;
                    if (sha512.sha512(req.body.oldPassword) === results[result].password) {
                        console.log("updating user " + req.body.oldName + "...");
                        var user = new User().genUserFromObject(results[result]);
                        user.name = req.body.newName;
                        user.password = sha512.sha512(req.body.newPassword);
                        user.firstName = req.body.newFirstName;
                        user.lastName = req.body.newLastName;
                        db.db("excersize-db").collection("users").updateOne({ name: req.body.oldName },
                            {
                                $set: {
                                    name: user.name,
                                    password: user.password,
                                    firstName: user.firstName,
                                    lastName: user.lastName
                                }
                            },
                            function (err, result) {
                                if (err) throw err;
                                if (result.modifiedCount > 0) {
                                    res.send("true");
                                } else {
                                    res.send("false");
                                }
                            }
                        )
                        loggedIn = true;
                        db.close();
                    }
                }
                if (!loggedIn) {
                    res.send("false");
                    db.close();
                }
            });
        });
    } else {
        res.send("false");
    }
})

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
                    if (results[result].name === newUser.name) {
                        foundUser = true;
                    }
                }
                // if statement has to be in here because database lookups are synchronous to server-side js
                if (foundUser == false) {
                    db.db("excersize-db").collection("users").insertOne(newUser, function(err, result) {
                        if (err) throw err;
                        if (result.insertedCount > 0) {
                            res.send("true");
                        } else {
                            res.send("false");
                        }
                        db.close();
                    });
                } else {
                    res.send("false");
                }
            });
        });
    } else {
        res.send("false");
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
                console.log(`${req.body.name} made progress! goal type ${user.goal.goalType}; steps: ${user.steps}; progress: ${user.goal.goalProgress}`);
                db.db("excersize-db").collection("users").updateOne(
                    { name: user.name },
                    {
                        $set:
                        {
                            steps: user.steps,
                            goal: {
                                goalType: user.goal.goalType,
                                goalValue: user.goal.goalValue,
                                goalProgress: user.goal.goalProgress
                            }
                        }
                    },
                    function (err, result) {
                        if (err) throw err;
                        res.send("true");
                    }
                );
            });
        });
    } else {
        res.send("false");
    }
});

app.post("/set-info", function (req, res, next) {
    if (checkKeys(req.body, ["name", "height", "weight", "stride-length"])) {
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
                        console.log(user.name + " updated info");
                        res.send("true");
                    }
                );
            });
        });
    } else {
        res.send("false");
    }
});

app.post("/set-goal", function (req, res, next) {
    if (checkKeys(req.body, ["name", "goalType", "goalValue"])) {
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
                                goalProgress: user.goal.goalProgress
                            }
                        }
                    },
                    function (err, result) {
                        if (err) throw err;
                        console.log(user.name + " updated goal:");
                        console.log(user.goal);
                        res.send("true");
                    }
                );
            });
        });
    } else {
        res.send("false");
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
        res.send("false");
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
        res.send("false");
    }
});

app.post("/add-friend", function (req, res, next) {
    if (checkKeys(req.body, ["name", "friendName"])) {
        mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            db.db("excersize-db").collection("users").findOne({ name: req.body.name }, function (err, result) {
                if (err) throw err;
                var user = (new User()).genUserFromObject(result);
                var hasFriend = false;
                for (var f in user.friends) {
                    if (user.friends[f] === req.body.friendName) {
                        hasFriend = true;
                    }
                }
                if (!hasFriend) {
                    user.friends.push(req.body.friendName);
                    db.db("excersize-db").collection("users").updateOne(
                        { name: user.name },
                        { $set: { friends: user.friends } },
                        function (err, result) {
                            if (err) throw err;
                            if (result.modifiedCount > 0) {
                                console.log(`${user.name} added ${req.body.friendName}`)
                                res.send("added");
                            } else {
                                res.send("unsuccessful");
                            }
                        }
                    );
                } else {
                    res.send("user already has friend");
                }
            });
        });
    } else {
        res.send("please include a name and friend name");
    }
})

app.post("/get-friends", function (req, res, next) {
    if (checkKeys(req.body, ["name"])) {
        mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            db.db("excersize-db").collection("users").findOne({ name: req.body.name }, function (err, result) {
                if (err) throw err;
                var user = (new User()).genUserFromObject(result);
                res.send(user.friends);
            });
        });
    } else {
        res.send("please include a name");
    }
});

app.post("/should-display-data", function(req, res, next) {
    if (checkKeys(req.body, ["name", "friendName"])) {
        mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            db.db("excersize-db").collection("users").findOne({ name: req.body.name }, function (err, result) {
                if (err) throw err;
                var user = (new User()).genUserFromObject(result);
                if (user.friends.includes(req.body.friendName)) {
                    db.db("excersize-db").collection("users").findOne({ name: req.body.friendName }, function (err, result) {
                        if (err) throw err;
                        if (result.friends.includes(user.name)) {
                            res.send("true");
                        } else {
                            res.send("false");
                        }
                    });
                } else {
                    res.send("false");
                }
            });
        });
    } else {
        res.send("please include a name and friend name");
    }
})

module.exports = app;