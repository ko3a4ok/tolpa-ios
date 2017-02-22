const SERVER_URL = "https://meethere-dev.herokuapp.com";
var HEADERS = new Headers();
export function updateHeader(token) {
  HEADERS.append('Content-Type', 'application/json');
  HEADERS.append('Cache-Control', 'no-cache');
  HEADERS.append('Authorization', 'Token ' + token);
}

export async function loginWithEmail(login, password) {
  let data = 'email='+login+'&password=' + password;
  try {
    let response = await fetch(SERVER_URL + "/auth/email/login",
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      }
    );
    let responseJson = await response.json();
    return responseJson;
  } catch(error) {
    console.error(error);
  }
  return null;
}

export async function checkEmail(email) {
  try {
    let response = await fetch(SERVER_URL + "/auth/email/check?email=" + email);
    let responseJson = await response.json();
    return responseJson.registered;
  } catch(error) {
    console.error(error);
  }
  return true;
}

export async function getEvents(categoryId, offset) {
  let url = SERVER_URL + "/find-event/tags/all/" + categoryId + "/";
  if (offset !== undefined)
    url += "?offset="+offset;
  try {
    let response = await fetch(url, {
      headers: HEADERS,
    });
    let responseJson = await response.json();
    return responseJson.results;
  } catch(error) {
    console.error(error);
  }
  return null;
}
