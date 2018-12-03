<template>
  <div class="jumbotron">
    <h1>Welcome back!</h1>
    <h2>To continue, please enter your username and password.</h2>
    <p>Username:</p>
    <input type="text" name="username">
    <p>Password:</p>
    <input type="password" name="password">
    <p></p>
    <div class="btn btn-primary" @click.prevent="login">Log in</div>
  </div>
</template>


<script>
import * as api from "@/services/api_access";
import * as cookieManager from "@/services/cookies";

export default {
    name: "login",
    methods: {
        login() {
            var username = document.getElementsByName("username")[0].value;
            var password = document.getElementsByName("password")[0].value;
            api.login(username, password).then(function(result) {
                var a = document.createElement("div");
                if (result === true) {
                    a.className = "alert alert-success";
                    a.innerText = "Login succeeded. Welcome back!";
                    cookieManager.setCookie("username", username, 7);
                    api.getFirstName(username).then(function(result) {
                        cookieManager.setCookie("firstName", result.firstName, 7);
                        api.getReadableName(username).then(function(result) {
                            cookieManager.setCookie("readableName", result.name, 7);
                            window.location = "/";
                        });
                    });
                } else {
                    a.className = "alert alert-danger";
                    a.innerText = "Login failed!";
                }
                document.getElementById("alert-pane").appendChild(a);
                setTimeout(function() {
                    a.className += " slideUp";
                    setTimeout(function() {
                        document.getElementById("alert-pane").removeChild(a);
                    }, 500);
                }, 5000);
            });
        }
    }
}
</script>
