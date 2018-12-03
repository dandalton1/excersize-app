<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <ul class="nav navbar-nav navbar-pills">
            <li class="nav-item">
                <router-link class="nav-link" exact-active-class="active" to="/">Home</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" exact-active-class="active" to="/about">About</router-link>
            </li>
            <li class="nav-item" v-if="username === null">
                <router-link class="nav-link" exact-active-class="active" to="/login">Log In</router-link>
            </li>
            <li class="nav-item" v-if="username === null">
                <router-link class="nav-link" exact-active-class="active" to="/sign-up">Sign Up</router-link>
            </li>
        </ul>
        <span class="navbar-text" v-if="firstName !== null">
            Welcome back, {{firstName}}!
        </span>
    </nav>
</template>

<script>
import * as api from "@/services/api_access";
export default {
  computed: {
      firstName: {
          get: function() {
              return api.firstName;
          }
      },
      username: {
          get: function() {
              return api.uname;
          }
      }
  }
}
</script>

