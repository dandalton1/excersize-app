<template>
  <div class="jumbotron">
    <h1>My Friends</h1>
    <p>Your friends' information will appear here.</p>
    <div id="friends"></div>
    <h1>Add Friends</h1>
    <p>In order to see a friend's information, they also need to friend you.</p>
    <p>To friend someone, type in their username and click the "add" button.</p>
    <form name="addFriend">
      <ul>
        <li>
          <input type="text" name="friendName" v-model="friendName" @keyup="updateAutoComplete">
        </li>
        <li
          v-for="user in autoCompletionSuggestions"
          v-bind:key="user.name"
          class="suggestion"
          @click.prevent="updateName(user.name)"
        >{{ user.name }}</li>
      </ul>
      <p>
        <button class="btn btn-primary" @click.prevent="addFriend">Add Friend</button>
      </p>
    </form>
  </div>
</template>

<script>
import * as cookieManager from "@/services/cookies";
import * as api from "@/services/api_access";
import * as goalFunctions from "@/services/goal_functions";

export default {
  name: "my-friends",
  data() {
    return {
      autoCompletionSuggestions: [],
      friendName: ""
    };
  },
  created() {
    api
      .getFriends(cookieManager.getCookieValue("username"))
      .then(function(response) {
        if (response === false) {
          var a = document.createElement("div");
          a.className = "alert alert-danger";
          a.innerText = "Could not get friends!";
          document.getElementById("alert-pane").appendChild(a);
          setTimeout(function() {
            a.className += " slideUp";
            setTimeout(function() {
              document.getElementById("alert-pane").removeChild(a);
            }, 500);
          }, 5000);
        } else {
          var friendsElement = document.getElementById("friends");
          for (let friend of response) {
            let friendElement = document.createElement("div");
            friendElement.className = "friend card";
            friendsElement.appendChild(friendElement);
            api
              .shouldDisplayData(
                cookieManager.getCookieValue("username"),
                friend
              )
              .then(function(shouldDisplayData) {
                let usernameText = document.createElement("h5");
                usernameText.innerText = friend;
                usernameText.className = "card-title";

                friendElement.appendChild(usernameText);

                if (shouldDisplayData === true) {
                  api.getFavoriteColor(friend).then(function(color) {
                    friendElement.style.borderColor = color;
                    api.getReadableName(friend).then(function(name) {
                      let nameText = document.createElement("p");
                      nameText.innerText = name.name;
                      friendElement.appendChild(nameText);
                      api.getGoal(friend).then(function(goal) {
                        if (goal !== false) {
                          let goalText = document.createElement("p");
                          goalText.innerText = goalFunctions.stringifyGoal(
                            goal
                          );
                          friendElement.appendChild(goalText);
                        }
                      });
                    });
                  });
                } else {
                  friendElement.style.borderColor = "gray";
                  let reminderText = document.createElement("p");
                  reminderText.innerText =
                    "In order to see more information about this friend, please, have them also add you as a friend.";
                  friendElement.appendChild(reminderText);
                }
              });
          }
        }
      });
  },
  methods: {
    addFriend() {
      api
        .addFriend(cookieManager.getCookieValue("username"), this.friendName)
        .then(function(result) {
          var a = document.createElement("div");
          if (result === true) {
            a.className = "alert alert-success";
            a.innerText = "Added friend!";
          } else {
            a.className = "alert alert-danger";
            a.innerText = "Could not add friend!";
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
    updateAutoComplete() {
      const ref = this;
      api.search(ref.friendName).then(function(result) {
        ref.autoCompletionSuggestions = result;
      });
    },
    updateName(name) {
      this.friendName = name;
      this.updateAutoComplete();
    }
  }
};
</script>

<style lang="scss" scoped>
.friend {
  border-radius: 5px;
  border-width: 1px;
  margin-bottom: 5px;
}

ul {
  list-style-type: none;
  padding: 0;
}

.suggestion {
  background: #bbb;
  animation-name: swoop;
  animation-duration: 0.5s;
  transform-origin: top;
  transition: background-color 0.5s;
  cursor: pointer;
  width: 75vw;
  &:hover {
    background-color: #ccc;
  }
}

input {
  width: 75vw;
}

@keyframes swoop {
  0% {
    transform: scaleY(0);
  }
  100% {
    transform: scaleY(1);
  }
}
</style>
