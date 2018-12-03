<template>
  <div>
    <span class="navbar-text" v-if="firstName !== undefined">Welcome back, {{firstName}}!</span>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <ul class="nav navbar-nav">
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
        <li class="nav-item" v-if="username !== undefined">
          <router-link class="nav-link" exact-active-class="active" to="/my-account">My Account</router-link>
        </li>
        <li class="nav-item" v-if="username !== undefined">
          <router-link class="nav-link" exact-active-class="active" to="/my-friends">My Friends</router-link>
        </li>
        <li class="nav-item" v-if="username !== undefined">
          <router-link class="nav-link" exact-active-class="active" to="/walk">Start Walking</router-link>
        </li>
        <li class="nav-item" v-if="username !== undefined">
          <a class="nav-link" href="javascript:void(0)" @click.prevent="logout">Log Out</a>
        </li>
      </ul>
    </nav>
  </div>
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
  },
  methods: {
      logout: function() {
          cookieManager.clearCookie();
          window.location = "/";
      }
  }
}
</script>

