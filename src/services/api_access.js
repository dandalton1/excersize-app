export let uname = null;
export let firstName = null;
export let readableName = null;
const api_root = `http://localhost:80`;

export function login(username, password) {
    return myFetch(`${api_root}/login`, {
        name: username,
        password: password
    }).then(function(x) {
        if (x === "true") {
            this.username = username;
        }
        return x;
    });
}

function getFirstName() {
  return myFetch(`${api_root}/get-first-name`, {name: uname}).then(function(response) {
    this.firstName = response;
    return response;
  });
}

function getReadableName() {
  return myFetch(`${api_root}/get-name`, {name: uname}).then(function(response) {
    this.readableName = response;
    return response;
  });
}

export function signup(username, password, firstName, lastName) {
  return myFetch(`${api_root}/sign-up`, {
      name: username,
      password: password,
      firstName: firstName,
      lastName: lastName
  }).then(function (x) {
      if (x === "true") {
          this.uname = username;
          getFirstName();
          getReadableName();
      }
      return x;
  });
}

function myFetch(url = ``, data = null, method = null) {
    let options = {
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        username: uname
      }
    };
    if (data) {
      options = {
        ...options,
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          ...options.headers,
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
  