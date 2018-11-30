<template>
  <div id="app" class="container">
    <div class="row display-3">
      <div class="col">
        Excersize App
      </div>
      <div class="col" style="text-align: right;">
        <span v-if="username !== null">Welcome back, {{readableName}}!</span>
      </div>
    </div>
    <Nav />
    <div id="alert-pane" style="position: sticky;"></div>
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
      info: {
        readableName: "",
        firstName: "",
        lastName: ""
      }
    }
  },
  components: {
    Nav: Nav
  },
  methods: {
    
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
