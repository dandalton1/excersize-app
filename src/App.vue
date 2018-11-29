<template>
  <div id="app" class="container">
    <div class="row display-3">
      <div class="col">
        Excersize App
      </div>
      <div class="col" style="text-align: right;">
        <span v-if="username === null">
          <div class="btn btn-primary" @click.prevent="login">
            Sign Up
          </div>
          &nbsp;
          <div class="btn btn-secondary" @click.prevent="login">
            Log in
          </div>
        </span>
        <span v-else>Welcome back, ${name}!</span>
      </div>
    </div>
    <Nav />
    <div id="alert-pane"></div>
    <router-view />
  </div>
</template>

<script>
import Nav from "@/components/Nav";
import * as api from "@/services/api_access";

export default {
  name: "app",
  data: function () {
    return {
      readableName: ""
    }
  },
  components: {
    Nav: Nav
  },
  methods: {
    bringUpPane() {

    },
    login() {
      api.login().then(function(result) {
        if (result === "true") {
          document.getElementById("alert-pane").className = "alert alert-success";
          document.getElementById("alert-pane").innerText = "Login suceeded!";
        } else {
          document.getElementById("alert-pane").className = "alert alert-danger";
          document.getElementById("alert-pane").innerText = "Login failed!";
        }
      });
    }
  },
  computed: {
    username() {
      return api.username;
    }
  }
}
</script>


<style lang="scss">
@import "../node_modules/bootstrap/scss/bootstrap.scss";
@import "global.scss";
</style>
