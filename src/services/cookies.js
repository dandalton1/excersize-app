function grabCookie() {
  let values = document.cookie.split(";");
  let result = {};
  for (let kvPair of values) {
    const key = kvPair.split("=")[0].trim();
    if (key === "" || key === undefined || key === null) {
      continue;
    }
    const value =
      kvPair.split("=").length > 1 ? kvPair.split("=")[1].trim() : "";
    result[key] = value;
  }
  return result;
}

function stringifyCookieJSON(cookieObject) {
  var result = "";
  if (cookieObject !== null && cookieObject !== undefined) {
    for (let key of Object.keys(cookieObject)) {
      if (key === "") {
        continue;
      } // skip empty keys
      if (cookieObject.hasOwnProperty(key)) {
        result += key + "=" + cookieObject[key] + "; ";
      }
    }
  }
  return result;
}

export function setCookie(name, value, expiryDays) {
  let cookie = {}; // COOKIE!!!
  let expiryDate = new Date(); // get today's date to start off with
  expiryDate.setTime(expiryDate.getTime() + expiryDays * 86400000); // there are 86,400,000 milliseconds in a day
  cookie[name] = value;
  cookie.expires = expiryDate.toUTCString();
  cookie.path = "/";
  document.cookie = stringifyCookieJSON(cookie);
}

export function getCookieValue(name) {
  let cookie = grabCookie(); // COOKIE!!!
  return cookie[name.trim()];
}

export function clearCookie() {
  let cookie = grabCookie(); // COOKIE!!!
  if (cookie !== null && cookie !== undefined) {
    for (let key of Object.keys(cookie)) {
      if (key === "") {
        continue;
      } // skip empty keys
      if (cookie.hasOwnProperty(key)) {
        setCookie(key, "", -10);
      }
    }
  }
}
