<template>
  <div id="app" class="container">
    <div class="row display-3">
      <div class="col">Excersize App</div>
    </div>
    <Nav/>
    <div id="alert-pane" style="position: fixed; top: 0;"></div>
    <router-view/>
  </div>
</template>

<script>
import Nav from "@/components/Nav";

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
