const SERVER_URL = "https://meethere-dev.herokuapp.com";
// const SERVER_URL = "http://10.0.0.113:8000";
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
  return await getResultByUrl(url, offset);
}

async function getResultByUrl(url, offset) {
  if (offset !== undefined)
    url += (url.includes("?") ? "&" : "?") + "offset="+offset;
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

export async function getEvent(eventId) {
  let url = SERVER_URL + "/event/" + eventId + "/";
  try {
    let response = await fetch(url, {
      headers: HEADERS,
    });
    let responseJson = await response.json();
    return responseJson;
  } catch(error) {
    console.error(error);
  }
  return null;
}

export async function joinEvent(eventId, join) {
  let url = SERVER_URL + "/event/" + eventId + "/manage";
  fetch(url,
    {
      method: join ? "POST" : "DELETE",
      headers: HEADERS,
    });
}

export async function getUserProfile(userId) {
  let url = SERVER_URL + "/profile/" + userId + "/";
  try {
    let response = await fetch(url, {
      headers: HEADERS,
    });
    let responseJson = await response.json();
    return responseJson;
  } catch(error) {
    console.error(error);
  }
  return null;
}

export async function getEventsCreatedBy(userId, offset) {
  let url = SERVER_URL + "/find-event/?created_by=" + userId;
  return await getResultByUrl(url, offset);
}

export async function getAttendedEvents(userId, past, offset) {
  let url = SERVER_URL + '/user/'+userId+'/events/' + (past ? "past/" : "future/");
  return await getResultByUrl(url, offset);
}

export async function getAttendersList(eventId, offset) {
  let url = SERVER_URL + '/event/' + eventId + '/attenders/';
  return await getResultByUrl(url, offset);
}
