<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <ul class="nav navbar-nav navbar-pills">
            <li class="nav-item">
                <router-link class="nav-link" exact-active-class="active" to="/">Home</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" exact-active-class="active" to="/about">About</router-link>
            </li>
            <li class="nav-item" v-if="username === undefined">
                <router-link class="nav-link" exact-active-class="active" to="/login">Log In</router-link>
            </li>
            <li class="nav-item" v-if="username === undefined">
                <router-link class="nav-link" exact-active-class="active" to="/sign-up">Sign Up</router-link>
            </li>
        </ul>
        <span class="navbar-text" v-if="firstName !== undefined">
            Welcome back, {{firstName}}!
        </span>
    </nav>
</template>

<script>
import * as cookieManager from "@/services/cookies";
export default {
  computed: {
      firstName: {
          get: function() {
              return cookieManager.getCookieValue("firstName");
          }
      },
      username: {
          get: function() {
              return cookieManager.getCookieValue("username");
          }
      }
  }
}
</script>

