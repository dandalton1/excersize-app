const express = require("express");
const { User, Goal } = require("./model");
const Database = require("./database");
const database = new Database();
const sha512 = require("js-sha512");
const { checkKeys } = require("../utils");

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/login", function(req, res) {
  if (checkKeys(req.body, ["name", "password"])) {
    let user = new User();
    user.name = req.body.name;
    user.password = sha512.sha512(req.body.password);
    database.lookup(user, function(err, result) {
      if (err) throw err;
      if (result) {
        res.send(user.password === result.password);
      } else {
        res.send("false");
      }
    });
  } else {
    res.send("false");
  }
});

app.post("/search", function(req, res) {
  if (checkKeys(req.body, ["query"])) {
    database.search(
      req.body.query,
      {
        name: 1,
        _id: 0
      },
      function(err, result) {
        if (err) throw err;
        if (result) {
          res.send(result);
        } else {
          res.send("[]");
        }
      }
    );
  } else {
    res.send("[]");
  }
});

app.delete("/delete-user", function(req, res) {
  if (checkKeys(req.body, ["name", "password"])) {
    let user = new User();
    user.name = req.body.name;
    database.lookup(user, function(err, result) {
      if (err) throw err;
      if (sha512.sha512(req.body.password) === result.password) {
        database.delete(user, function(err, result) {
          if (err) throw err;
          res.send(result.deletedCount > 0);
        });
      } else {
        res.send("false");
      }
    });
  } else {
    res.send("false");
  }
});

app.put("/update-user-info", function(req, res) {
  if (
    checkKeys(req.body, [
      "oldName",
      "oldPassword",
      "newName",
      "newPassword",
      "newFirstName",
      "newLastName"
    ])
  ) {
    let user = new User();
    user.name = req.body.oldName;
    user.password = sha512.sha512(req.body.oldPassword);
    database.lookup(user, function(err, result) {
      if (result.password === user.password) {
        let newUser = new User().genUserFromObject(user);
        newUser.name = req.body.newName;
        newUser.password = sha512.sha512(req.body.newPassword);
        newUser.firstName = req.body.newFirstName;
        newUser.lastName = req.body.newLastName;
        database.update(user, newUser, function(result) {
          res.send(result);
        });
      } else {
        res.send("false");
      }
    });
  } else {
    res.send("false");
  }
});

app.post("/sign-up", function(req, res) {
  if (checkKeys(req.body, ["name", "firstName", "lastName", "password"])) {
    var name = req.body.name;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var password = req.body.password;
    var newUser = new User();
    newUser.generate(name, firstName, lastName, password);
    database.add(newUser, function(result) {
      res.send(result);
    });
  } else {
    res.send("false");
  }
});

app.post("/step", function(req, res) {
  // ideally: this is going to be requested through AJAX whenever the user takes a step
  if (checkKeys(req.body, ["name"])) {
    var user = new User();
    user.name = req.body.name;
    database.lookup(user, function(err, result) {
      if (err) throw err;
      var newUser;
      if (result.name === user.name) {
        newUser = new User().genUserFromObject(result);
        newUser.step();
        database.update(user, newUser, function(result) {
          res.send(result);
        });
      } else {
        res.send("false");
      }
    });
  } else {
    res.send("false");
  }
});

app.post("/set-info", function(req, res) {
  if (
    checkKeys(req.body, ["name", "height", "weight", "strideLength", "color"])
  ) {
    var user = new User();
    user.name = req.body.name;
    database.lookup(user, function(err, result) {
      if (err) throw err;
      var newUser;
      if (user.name === result.name) {
        newUser = new User().genUserFromObject(user).genUserFromObject(result);
        try {
          newUser.height = parseInt(req.body.height);
          newUser.weight = parseInt(req.body.weight);
          newUser.strideLength = parseInt(req.body.strideLength);
          newUser.favoriteColor = req.body.color;
          newUser.goal = {};
          database.update(user, newUser, function(result) {
            res.send(result);
          });
        } catch (e) {
          res.send("false");
        }
      } else {
        res.send("false");
      }
    });
  } else {
    res.send("false");
  }
});

app.post("/set-goal", function(req, res) {
  if (checkKeys(req.body, ["name", "goalType", "goalValue"])) {
    var user = new User();
    user.name = req.body.name;
    try {
      parseInt(req.body.goalType);
      parseInt(req.body.goalValue);
      database.lookup(user, function(err, result) {
        if (err) throw err;
        var newUser;
        if (user.name === result.name) {
          newUser = new User().genUserFromObject(result);
          newUser.goal = new Goal().createNewGoal(
            req.body.goalType,
            req.body.goalValue
          );
          database.update(user, newUser, function(result) {
            res.send(result);
          });
        } else {
          res.send("false");
        }
      });
    } catch (e) {
      res.send("false");
    }
  } else {
    res.send("false");
  }
});

app.post("/get-goal", function(req, res) {
  if (checkKeys(req.body, ["name"])) {
    let user = new User();
    user.name = req.body.name;
    database.lookup(user, function(err, result) {
      if (err) throw err;
      res.send(result.goal);
    });
  } else {
    res.send("name required");
  }
});

app.post("/get-name", function(req, res) {
  if (checkKeys(req.body, ["name"])) {
    let user = new User();
    user.name = req.body.name;
    database.lookup(user, function(err, result) {
      if (err) throw err;
      user = new User().genUserFromObject(result);
      res.send(`{"name": "${user.firstName} ${user.lastName}"}`);
    });
  } else {
    res.send("false");
  }
});

app.post("/get-first-name", function(req, res) {
  if (checkKeys(req.body, ["name"])) {
    let user = new User();
    user.name = req.body.name;
    database.lookup(user, function(err, result) {
      if (err) throw err;
      user = new User().genUserFromObject(result);
      res.send(`{"firstName": "${user.firstName}"}`);
    });
  } else {
    res.send("false");
  }
});

app.post("/get-favorite-color", function(req, res) {
  if (checkKeys(req.body, ["name"])) {
    let user = new User();
    user.name = req.body.name;
    database.lookup(user, function(err, result) {
      if (err) throw err;
      user = new User().genUserFromObject(result);
      res.send(`{"favoriteColor": "${user.favoriteColor}"}`);
    });
  } else {
    res.send("false");
  }
});

app.post("/add-friend", function(req, res) {
  if (checkKeys(req.body, ["name", "friendName"])) {
    if (req.body.name !== req.body.friendName) {
      let user = new User();
      user.name = req.body.name;
      database.lookup(user, function(err, result) {
        if (err) throw err;
        if (result) {
          var newUser = new User().genUserFromObject(result);
          let friend = new User();
          friend.name = req.body.friendName;
          database.lookup(friend, function(err, result) {
            if (err) throw err;
            if (result) {
              var friendUser = new User().genUserFromObject(result);
              var hasFriend = false;
              for (var f in newUser.friends) {
                if (newUser.friends[f] === friendUser.name) {
                  hasFriend = true;
                }
              }
              if (!hasFriend) {
                newUser.friends.push(friendUser.name);
                database.update(user, newUser, function(result) {
                  res.send(result);
                });
              } else {
                res.send("false");
              }
            } else {
              res.send("false");
            }
          });
        }
      });
    } else {
      res.send("false");
    }
  } else {
    res.send("false");
  }
});

app.post("/get-friends", function(req, res) {
  if (checkKeys(req.body, ["name"])) {
    let user = new User();
    user.name = req.body.name;
    database.lookup(user, function(err, result) {
      if (err) throw err;
      user = new User().genUserFromObject(result);
      res.send(user.friends);
    });
  } else {
    res.send("false");
  }
});

app.post("/should-display-data", function(req, res) {
  if (checkKeys(req.body, ["name", "friendName"])) {
    let user = new User();
    user.name = req.body.name;
    database.lookup(user, function(err, result) {
      if (err) throw err;
      user = new User().genUserFromObject(result);
      if (user.friends.includes(req.body.friendName)) {
        let friend = new User();
        if (result) {
          friend.name = req.body.friendName;
          database.lookup(friend, function(err, result) {
            if (err) throw err;
            if (result) {
              res.send(result.friends.includes(user.name));
            } else {
              res.send("false");
            }
          });
        } else {
          res.send("false");
        }
      } else {
        res.send("false");
      }
    });
  } else {
    res.send("false");
  }
});

module.exports = app;
