<template>
  <div>
    <span class="navbar-text" v-if="firstName !== undefined">Welcome back, {{firstName}}!</span>
    <nav
      class="navbar navbar-expand-lg"
      v-bind:class="{ 'navbar-dark': dark, 'navbar-light': !dark }"
      v-bind:style="{ backgroundColor: favoriteColor }"
    >
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
import * as api from "@/services/api_access";
export default {
    data () {
        return {
            favoriteColor: "#000000",
            dark: true
        }
    },
    created () {
        var ref = this;
        api.getFavoriteColor(cookieManager.getCookieValue("username")).then(function(response) {
            ref.favoriteColor = response.favoriteColor;

            if (response.favoriteColor === null || response.favoriteColor === undefined) {
                ref.favoriteColor = "#000000";
            }

            // see https://stackoverflow.com/a/12043228/2089760 for how I get this
            const rgb = parseInt(ref.favoriteColor.substring(1), 16);
            const r = (rgb >> 16) & 0xff;
            const g = (rgb >>  8) & 0xff;
            const b =         rgb & 0xff;

            const lum = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);

            if (lum > 0.5) { ref.dark = false; }
        });
    },
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

