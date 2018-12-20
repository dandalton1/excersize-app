<template>
  <div class="jumbotron">
    <h1>Walking</h1>
    <p>Just press the button when you take a step. Simple!</p>
    <button
      class="btn"
      style="font-size: 5em; padding: 20px;"
      v-bind:class="{ 'text-dark': !dark, 'text-light': dark }"
      v-bind:style="{ backgroundColor: favoriteColor }"
      @click.prevent="step"
    >Step</button>
    <p>&nbsp;</p>
    <p>
      (Unfortunately, we can't use your accelerometer, if you have one, due to the simple fact that it's
      a huge security risk to be able to lock your phone and have a webpage still be tracking the phone's
      sensors.)
    </p>
    <div v-if="goal !== null && goal !== undefined && goal !== {}">

    </div>
  </div>
</template>

<script>
import * as cookieManager from "@/services/cookies";
import * as api from "@/services/api_access";

export default {
  name: "walk",
  data() {
    return {
      favoriteColor: "#000000",
      dark: true,
      goal: {}
    };
  },
  created() {
    var ref = this;
    api
      .getFavoriteColor(cookieManager.getCookieValue("username"))
      .then(function(response) {
        ref.favoriteColor = response.favoriteColor;

        if (
          response.favoriteColor === null ||
          response.favoriteColor === undefined
        ) {
          ref.favoriteColor = "#000000";
        }

        try {
          // see https://stackoverflow.com/a/12043228/2089760 for how I get this
          const rgb = parseInt(ref.favoriteColor.substring(1), 16);
          const r = (rgb >> 16) & 0xff;
          const g = (rgb >> 8) & 0xff;
          const b = rgb & 0xff;

          const lum = (r + g + b) / 765;

          if (lum > 0.5) {
            ref.dark = false;
          }
        } catch (e) {
          ref.favoriteColor = "#000000";
        }
      });
    ref.getGoal();
  },
  methods: {
    getGoal() {
      var ref = this;
      api
        .getGoal(cookieManager.getCookieValue("username"))
        .then(function(response) {
          ref.goal = response;
        });
    },
    step() {
      var ref = this;
      api
        .step(cookieManager.getCookieValue("username"))
        .then(function(response) {
          if (response === false) {
            var a = document.createElement("div");
            a.className = "alert alert-danger";
            a.innerText = "Submitting step failed!";
            document.getElementById("alert-pane").appendChild(a);
            setTimeout(function() {
              a.className += " slideUp";
              setTimeout(function() {
                document.getElementById("alert-pane").removeChild(a);
              }, 500);
            }, 5000);
          } else {
            api
              .getGoal(cookieManager.getCookieValue("username"))
              .then(function(response) {
                ref.goal = response;
              });
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.text-dark {
  color: black;
}
.text-light {
  color: white;
}
</style>
