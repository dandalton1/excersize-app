<template>
  <div class="jumbotron">
    <h1>Walking</h1>
    <p>Just press the button when you take a step. Simple!</p>
    <button class="btn btn-primary" style="font-size: 5em; padding: 20px;">Step</button>
    <p>
      (Unfortunately, we can't use your accelerometer, if you have one, due to the simple fact that it's
      a huge security risk to be able to lock your phone and have a webpage still be tracking the phone's
      sensors.)
    </p>
  </div>
</template>

<script>
export default {
    name: "walk"
}
</script>
