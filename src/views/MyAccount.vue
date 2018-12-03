<template>
  <div class="jumbotron">
    <h1>My Account</h1>
    <p>Here's some settings you can change.</p>
    <p>&nbsp;</p>
    <h2>Add More Information</h2>
    <p>In order to add a goal, you need some more information on your account.</p>
    <p>This is needed for calculations such as calculating calories or how far you walked.</p>
    <form name="add-more-info">
      <p>Height (in inches):</p>
      <input type="number" name="height">
      <p>Weight (in pounds):</p>
      <input type="number" name="weight">
      <p>Stride length (in inches):</p>
      <input type="number" name="stride-length">
      <p>Favorite Color (in hex, or, if applicable, use color picker):</p>
      <input type="color" name="favorite-color">
      <p>&nbsp;</p>
      <button class="btn btn-primary" @click.prevent="addMoreInfo">Submit</button>
    </form>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <h2>Reset your information</h2>
    <p>For your security, we're going to need your password again. This is because, well, you can also reset your password.</p>
    <form name="edit-account">
      <p>Old password:</p>
      <input type="password" name="old-password">
      <p>New password:</p>
      <input type="password" name="new-password">
      <p>New username:</p>
      <input type="text" name="userName">
      <p>First Name:</p>
      <input type="text" name="firstName">
      <p>Last Name:</p>
      <input type="text" name="lastName">
      <p>&nbsp;</p>
      <button class="btn btn-primary" @click.prevent="editAccount">Update</button>
    </form>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <h2>Delete Your Account</h2>
    <p>We're sorry to see you go... :'(</p>
    <p>Before you go, please, enter your password, one last time.</p>
    <form name="delete-account">
      <input type="password" name="password">
      <p>&nbsp;</p>
      <button class="btn btn-danger" @click.prevent="deleteAccount">Delete Account</button>
    </form>
  </div>
</template>

<script>
import * as api from "@/services/api_access";
import * as cookieManager from "@/services/cookies";

export default {
  name: "my-account",
  methods: {
    editAccount() {
      var formResult = document.getElementsByName("edit-account")[0];
      api
        .updateInfo(
          cookieManager.getCookieValue("username"),
          formResult[0].value,
          formResult[2].value,
          formResult[1].value,
          formResult[3].value,
          formResult[4].value
        )
        .then(function(result) {
          var a = document.createElement("div");
          if (result === true) {
            a.className = "alert alert-success";
            a.innerText = "Info successfully updated!";
            cookieManager.setCookie("username", formResult[2].value, 7);
            api
              .getFirstName(cookieManager.getCookieValue("username"))
              .then(function(result) {
                cookieManager.setCookie("firstName", result.firstName, 7);
                api
                  .getReadableName(cookieManager.getCookieValue("username"))
                  .then(function(result) {
                    cookieManager.setCookie("readableName", result.name, 7);
                    window.location = "/";
                  });
              });
          } else {
            a.className = "alert alert-danger";
            a.innerText =
              "Setting information was unsuccessful! Was your password correct?";
          }
          document.getElementById("alert-pane").appendChild(a);
          setTimeout(function() {
            a.className += " slideUp";
            setTimeout(function() {
              document.getElementById("alert-pane").removeChild(a);
            }, 500);
          }, 5000);
        });
    },
    addMoreInfo() {
      var formResult = document.getElementsByName("add-more-info")[0];
      api
        .addMoreInfo(
          cookieManager.getCookieValue("username"),
          formResult[0].value,
          formResult[1].value,
          formResult[2].value,
          formResult[3].value
        )
        .then(function(result) {
          var a = document.createElement("div");
          if (result === true) {
            a.className = "alert alert-success";
            a.innerText = "Info successfully updated!";
            window.location = "/";
          } else {
            a.className = "alert alert-danger";
            a.innerText = "Setting information was unsuccessful!";
          }
          document.getElementById("alert-pane").appendChild(a);
          setTimeout(function() {
            a.className += " slideUp";
            setTimeout(function() {
              document.getElementById("alert-pane").removeChild(a);
            }, 500);
          }, 5000);
        });
    },
    deleteAccount() {
      var formResult = document.getElementsByName("delete-account")[0];
      if (confirm("Are you sure you want to delete your account?")) {
        if (confirm("Are you SURE you're sure?")) {
          if (
            confirm(
              "Are you sure you're sure you're sure? After that, we won't bug you."
            )
          ) {
            api
              .deleteAccount(
                cookieManager.getCookieValue("username"),
                formResult[0].value
              )
              .then(function(result) {
                var a = document.createElement("div");
                if (result === true) {
                  a.className = "alert alert-success";
                  a.innerText = "Goodbye, my friend.";
                  cookieManager.clearCookie();
                  window.location = "/";
                } else {
                  a.className = "alert alert-danger";
                  a.innerText = "Your password wasn't correct.";
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
    }
  }
};
</script>
