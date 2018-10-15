const sha512 = require("js-sha512");

class User {
    constructor() {
        this.password = "";
        this.name = "";
        this.firstName = "";
        this.lastName = "";
        this.height = 0;
        this.weight = 0;
        this.steps = 0;
        this.goal = null;
    }

    step() {
        this.steps++;
    }

    generate(name, firstName, lastName, password) {
        this.name = name;
        this.firstName = firstName;
        this.lastName = lastName;
        console.log(password);
        this.password = sha512.sha512(password);
    }
}

module.exports = {
    User
}