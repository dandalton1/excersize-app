export let username = null;
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

export function signup(username, password, firstName, lastName) {
  return myFetch(`${api_root}/sign-up`, {
      name: username,
      password: password,
      firstName: firstName,
      lastName: lastName
  }).then(function (x) {
      if (x === "true") {
          this.username = username;
      }
      return x;
  });
}

function myFetch(url = ``, data = null, method = null) {
    let options = {
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        username: username
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
  