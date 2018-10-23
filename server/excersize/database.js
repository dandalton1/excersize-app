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

class Database {
    constructor() {
        this.init();
    }

    init() {
        mongo.connect(url, { useNewUrlParser: true, noDelay: true }, function (err, db) {
            if (err) throw err;
            console.log("database created");
            db.db("excersize-db").createCollection("users", function (err, res) {
                if (err) throw err;
                console.log("created users collection");
            });
        });
    }

    lookup(user, callback) {
        mongo.connect(url, { useNewUrlParser: true, noDelay: true }, function (err, db) {
            if (err) throw err;
            db.db("excersize-db").collection("users").findOne({ name: user.name }, function (err, result) {
                if (err) { throw err; }
                callback(err, result);
            });
            db.close();
        });
    }

    delete(user, callback) {
        mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            db.db("excersize-db").collection("users").deleteOne({ name: user.name }, callback);
            db.close();
        });
    }

    update(user, newUser, callback) {
        this.lookup(user, function (err, result) {
            if (err) throw err;
            if (result.name === user.name) {
                mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
                    if (err) throw err;
                    db.db("excersize-db").collection("users").updateOne({ name: user.name }, { $set: newUser }, function (err, result) {
                        if (err) throw err;
                        callback(result.modifiedCount > 0);
                        db.close();
                    });
                });
            } else {
                callback(false);
            }
        });
    }

    add(user, callback) {
        this.lookup(user, function (err, result) {
            if (err) throw err;
            if (result) {
                if (result.name === user.name) {
                    callback(false);
                }
            } else {
                mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
                    if (err) throw err;
                    db.db("excersize-db").collection("users").insertOne(user, function (err, result) {
                        if (err) throw err;
                        callback(result.insertedCount > 0);
                        db.close();
                    });
                });
            }
        });
    }
}

module.exports = Database;