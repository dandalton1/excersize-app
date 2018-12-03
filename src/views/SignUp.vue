<template>
  <div class="jumbotron">
    <h1>Welcome!</h1>
    <h2>To sign up, please enter your username, first name, last name, and password.</h2>
    <p>Username:</p>
    <input type="text" name="username">
    <p>First name:</p>
    <input type="text" name="firstname">
    <p>Last name:</p>
    <input type="text" name="lastname">
    <p>Password:</p>
    <input type="password" name="password">
    <p></p>
    <div class="btn btn-primary" @click.prevent="signup">Sign Up</div>
  </div>
</template>

<script>
import * as api from "@/services/api_access";
import * as cookieManager from "@/services/cookies";

export default {
    name: "sign-up",
    methods: {
        signup() {
            var username = document.getElementsByName("username")[0].value;
            var password = document.getElementsByName("password")[0].value;
            var firstName = document.getElementsByName("firstname")[0].value;
            var lastName = document.getElementsByName("lastname")[0].value;
            api.signup(username, password, firstName, lastName).then(function(result) {
                var a = document.createElement("div");
                if (result === true) {
                    a.className = "alert alert-success";
                    a.innerText = "Sign-up succeeded. Welcome!";
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
                    a.innerText = "Sign-up failed!";
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
