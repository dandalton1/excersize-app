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
    this.strideLength = 0;
    this.goal = {};
    this.friends = [];
    this.favoriteColor = "#000000";
  }

  verify(user, password) {
    return sha512.sha512(user.password) === password;
  }

  genUserFromObject(o) {
    var keys = Object.keys(o);
    for (var key in keys) {
      this[keys[key]] = o[keys[key]];
    }
    return this;
  }

  step() {
    this.steps++;
    if (this.goal) {
      let g = new Goal();
      g.goalProgress = this.goal.goalProgress;
      g.goalType = this.goal.goalType;
      g.goalValue = this.goal.goalValue;
      g.calculateProgress(this);
    }
  }

  generate(name, firstName, lastName, password) {
    this.name = name;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = sha512.sha512(password);
    this.goal = new Goal();
    return this;
  }
}

class Goal {
  constructor() {
    this.goalType = GoalTypes.STEPS;
    this.goalValue = 0;
    this.goalProgress = 0;
  }

  calculateProgress(user) {
    switch (this.goalType) {
      case GoalTypes.MILES: {
        this.goalProgress =
          ((1 / (12 / user.strideLength) / 5280) * user.steps) / this.goalValue;
        break;
      }
      case GoalTypes.STEPS: {
        this.goalProgress = user.steps / this.goalValue;
        break;
      }
      case GoalTypes.WEIGHT_LOSS: {
        // formula: https://www.livestrong.com/article/238020-how-to-convert-pedometer-steps-to-calories/
        // 3500 cal = 1 lb loss
        let stepsInAMile = 5280 * (user.strideLength / 12);
        let calPerMile = 0.57 * user.weight;
        let lbPerMile = calPerMile / 3500;
        let lbPerStep = lbPerMile / stepsInAMile;
        this.goalProgress = (lbPerStep * user.steps) / this.goalValue;
        break;
      }
      default: {
        console.log("user has invalid goal type: " + this.goalType);
        break;
      }
    }
  }

  createNewGoal(goalType, goalValue) {
    this.goalType = parseInt(goalType);
    this.goalValue = parseInt(goalValue);
    this.goalProgress = 0;
    return this;
  }
}

var GoalTypes = Object.freeze({
  STEPS: 0,
  WEIGHT_LOSS: 1,
  MILES: 2
});

module.exports = {
  User,
  Goal,
  GoalTypes
};
