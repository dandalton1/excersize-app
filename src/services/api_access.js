const api_root = `http://localhost:80`;


export function login(username, password) {
  return myFetch(`${api_root}/login`, {
    name: username,
    password: password
  });
}

export function search(query) {
  return myFetch(`${api_root}/search`, {
    query: query
  })
}

export function updateInfo(
  oldUsername,
  oldPassword,
  newUsername,
  newPassword,
  newFirstName,
  newLastName
) {
  return myFetch(
    `${api_root}/update-user-info`,
    {
      oldName: oldUsername,
      oldPassword: oldPassword.toString(),
      newName: newUsername,
      newPassword: newPassword.toString(),
      newFirstName: newFirstName,
      newLastName: newLastName
    },
    "PUT"
  );
}

export function addMoreInfo(username, height, weight, strideLength, color) {
  return myFetch(`${api_root}/set-info`, {
    name: username,
    height: height,
    weight: weight,
    strideLength: strideLength,
    color: color
  });
}

export function deleteAccount(username, password) {
  return myFetch(`${api_root}/delete-user`, {
    name: username,
    password: password
  }, "DELETE");
}

export function getFirstName(username) {
  return myFetch(`${api_root}/get-first-name`, { name: username });
}

export function getReadableName(username) {
  return myFetch(`${api_root}/get-name`, { name: username });
}

export function getFavoriteColor(username) {
  return myFetch(`${api_root}/get-favorite-color`, { name: username });
}

export function step(username) {
  return myFetch(`${api_root}/step`, { name: username });
}

export function signup(username, password, firstName, lastName) {
  return myFetch(`${api_root}/sign-up`, {
    name: username,
    password: password,
    firstName: firstName,
    lastName: lastName
  });
}

export function getGoal(username) {
  return myFetch(`${api_root}/get-goal`, {name: username});
}

export function setGoal(username, goalType, goalValue) {
  return myFetch(`${api_root}/set-goal`, {name: username, goalType: goalType, goalValue: goalValue});
}

export function addFriend(username, friendName) {
  return myFetch(`${api_root}/add-friend`, {name: username, friendName: friendName});
}

export function getFriends(username) {
  return myFetch(`${api_root}/get-friends`, {name: username});
}

export function shouldDisplayData(username, friendName) {
  return myFetch(`${api_root}/should-display-data`, {name: username, friendName: friendName});
}

function myFetch(url = ``, data = null, method = null) {
  let options = {
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin" // include, same-origin, *omit
    // we really don't use values stored in headers lol
  };
  if (data) {
    options = {
      ...options,
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    };
  }
  if (method) {
    options.method = method;
  }
  return fetch(url, options).then(response => {
    return response.json();
  }); // parses response to JSON
}
