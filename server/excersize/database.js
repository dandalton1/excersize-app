const mongo = require("mongodb").MongoClient;

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

let collection = null;

class Database {
  constructor() {
    this.init();
  }

  init() {
    mongo.connect(
      url,
      { useNewUrlParser: true, noDelay: true },
      function(err, db) {
        if (err) throw err;
        //eslint-disable-next-line
        console.log("database created");
        db.db("excersize-db").createCollection("users", function(err) {
          if (err) throw err;
          //eslint-disable-next-line
          console.log("created users collection");
          collection = db.db("excersize-db").collection("users");
        });
      }
    );
  }

  lookup(user, callback) {
    collection.findOne({ name: user.name }, function(err, result) {
      if (err) {
        throw err;
      }
      callback(err, result);
    });
  }

  search(query, fields, callback) {
    collection
      .find({
        name: { $regex: new RegExp("^" + this.escapeRegExp(query) + ".+") }
      })
      .project(fields)
      .toArray(function(err, result) {
        if (err) {
          throw err;
        }
        callback(err, result);
      });
  }

  // from https://stackoverflow.com/a/6969486/2089760
  // Yeah, I did use all of one line from StackOverflow, but this helps allow for a user to do
  // something stupid like type a * and have the server not completely break lol
  // regular expressions are a mess
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }

  delete(user, callback) {
    collection.deleteOne({ name: user.name }, callback);
  }

  update(user, newUser, callback) {
    this.lookup(user, function(err, result) {
      if (err) throw err;
      if (
        result === undefined ||
        result === null ||
        user === null ||
        newUser === null
      ) {
        callback(false);
      } else if (result.name === user.name) {
        collection.updateOne({ name: user.name }, { $set: newUser }, function(
          err,
          result
        ) {
          if (err) throw err;
          callback(result.modifiedCount > 0);
        });
      } else {
        callback(false);
      }
    });
  }

  add(user, callback) {
    this.lookup(user, function(err, result) {
      if (err) throw err;
      if (result) {
        if (result.name === user.name) {
          callback(false);
        }
      } else {
        collection.insertOne(user, function(err, result) {
          if (err) throw err;
          callback(result.insertedCount > 0);
        });
      }
    });
  }
}

module.exports = Database;
