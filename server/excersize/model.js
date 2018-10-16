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

    genUserFromObject(o) {
        this.password = o.password;
        this.name = o.name;
        this.firstName = o.firstName;
        this.lastName = o.lastName;
        this.height = o.height;
        this.weight = o.weight;
        this.steps = o.steps;
        this.goal = o.goal;
        return this;
    }

    step() {
        this.steps++;
    }

    generate(name, firstName, lastName, password) {
        this.name = name;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = sha512.sha512(password);
    }
}

module.exports = {
    User
}