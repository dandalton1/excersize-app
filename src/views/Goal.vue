<template>
  <div class="jumbotron">
    <h1>Current Goal</h1>
    <p
      v-if="goal === null || goal === undefined || JSON.stringify(goal) === '{}'"
    >You do not yet have a goal set. You should set one!</p>
    <p v-else>{{goalString}}</p>
    <form name="set-goal">
      <p>What kind of goal are you going for?</p>
      <p>
        <input
          type="radio"
          name="goalType"
          value="0"
          checked="checked"
          v-model.number="goalType"
          @change="updateUnits"
        > Walking - steps
      </p>
      <p>
        <input type="radio" name="goalType" value="1" v-model.number="goalType" @change="updateUnits"> Weight loss
      </p>
      <p>
        <input type="radio" name="goalType" value="2" v-model.number="goalType" @change="updateUnits"> Walking - miles
      </p>
      <p>How many {{goalUnits}} do you want to try for? (Integers/whole numbers only.)</p>
      <input type="text" name="goalValue" v-model.number="goalValue">
      <p>&nbsp;</p>
      <button @click.prevent="setGoal" class="btn btn-primary">Set Goal</button>
    </form>
  </div>
</template>

<script>
import * as cookieManager from "@/services/cookies";
import * as api from "@/services/api_access";
import * as goalFunctions from "@/services/goal_functions";

export default {
  name: "goal",
  data() {
    return {
      goal: {},
      goalString: "",
      goalUnits: "steps",
      goalType: 0,
      goalValue: 0
    };
  },
  created() {
    var ref = this;
    ref.getGoal();
  },
  methods: {
    getGoal() {
      var ref = this;
      api
        .getGoal(cookieManager.getCookieValue("username"))
        .then(function(response) {
          ref.goal = response;
          if (
            ref.goal !== null &&
            ref.goal !== undefined &&
            JSON.stringify(ref.goal) !== "{}"
          ) {
            ref.goalString = goalFunctions.stringifyGoal(response);
          }
        });
    },
    setGoal() {
      var ref = this;
      var a = document.createElement("div");
      try {
        api
          .setGoal(
            cookieManager.getCookieValue("username"),
            parseInt(this.goalType),
            parseInt(this.goalValue)
          )
          .then(function(result) {
            if (result === true) {
              a.className = "alert alert-success";
              a.innerText = "Goal set!";
              ref.getGoal();
            } else {
              a.className = "alert alert-danger";
              a.innerText = "Could not set goal!";
            }
            document.getElementById("alert-pane").appendChild(a);
            setTimeout(function() {
              a.className += " slideUp";
              setTimeout(function() {
                document.getElementById("alert-pane").removeChild(a);
              }, 500);
            }, 5000);
          });
      } catch (e) {
        a.className = "alert alert-danger";
        a.innerText =
          "Error setting goal! Did you make sure to use whole numbers?";
        document.getElementById("alert-pane").appendChild(a);
        setTimeout(function() {
          a.className += " slideUp";
          setTimeout(function() {
            document.getElementById("alert-pane").removeChild(a);
          }, 500);
        }, 5000);
      }
    },
    updateUnits() {
      this.goalUnits = goalFunctions.getUnitsForGoalType(
        parseInt(this.goalType),
        parseInt(this.goalValue)
      );
    }
  }
};
</script>
