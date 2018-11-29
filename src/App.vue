<template>
  <div id="app" class="container">
    <div class="display-3">
      Excersize App
    </div>
    <Nav />
    <router-view />
  </div>
</template>

<script>
import Nav from "@/components/Nav"

export default {
  name: "app",
  components: {
    Nav: Nav
  }
}
</script>


<style lang="scss">
@import "../node_modules/bootstrap/scss/bootstrap.scss";
@import "global.scss";
</style>
