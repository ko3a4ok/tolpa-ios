const SERVER_URL = "https://meethere-dev.herokuapp.com";
// SERVER_URL = "http://10.0.0.113:8000";
var HEADERS = new Headers();
export function updateHeader(token) {
  HEADERS.append('Content-Type', 'application/json');
  HEADERS.append('Cache-Control', 'no-cache');
  HEADERS.append('Authorization', 'Token ' + token);
}

async function _sign(data, path) {
  try {
    let response = await fetch(SERVER_URL + path,
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      }
    );
    return await response.json();
  } catch(error) {
    console.error(error);
  }
  return null;
}
export async function loginWithEmail(login, password) {
  let data = 'email='+login+'&password=' + password;
  let path = "/auth/email/login";
  return await _sign(data, path);
}


export async function signUp(login, password, first_name, last_name) {
  let params = {
    email: login,
    password: password,
    username: login,
    first_name: first_name,
    last_name: last_name,
  };

  let esc = encodeURIComponent;
  let data = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');
  let path = "/auth/register";
  return await _sign(data, path);

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

export async function getFollowList(userId, following, offset) {
  let url = SERVER_URL + '/user/' + userId + (following ? '/followings/': '/followers/');
  return await getResultByUrl(url, offset);
}

export async function followUser(userId, follow) {
  let url = SERVER_URL + "/user/" + userId + "/follow";
  fetch(url,
    {
      method: follow ? "POST" : "DELETE",
      headers: HEADERS,
    });
}

export async function searchEventsByText(text, offset, params='') {
  let url = SERVER_URL + "/search/all/?q=" + text + params;
  return await getResultByUrl(url, offset);
}


export async function searchUsersByText(text, offset) {
  let url = SERVER_URL + "/user/search/?q=" + text;
  return await getResultByUrl(url, offset);
}

export async function getPopularCategories() {
  let url = SERVER_URL + "/tags/popular";
  let result = await getResultByUrl(url, 0);
  if (!result) return null;
  return result.map((x) => x.id);
}

export async function findEventsNear(lon, lat) {
  let url = SERVER_URL + "/search/future/?lat=" + lat + "&lon=" + lon + "&limit=30";
  return await getResultByUrl(url);
}


export async function updateProfile(user_id, data) {
  try {
    let response = await fetch(SERVER_URL + "/profile/" + user_id + "/",
      {
        method: "PATCH",
        headers: HEADERS,
        body: data,
      }
    );
    if (response.status > 200) return null;
    let responseJson = await response.json();
    return responseJson;
  } catch(error) {
    console.error(error);
  }
  return null;
}


async function uploadImage(url, fileUri) {
  var formData  = new FormData();
  formData.append('file', {uri: fileUri, type: 'image/jpg', name: 'file'} );
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': HEADERS.get('Authorization'),
      'Content-Type': 'multipart/form-data',
      'Content-Disposition': 'form-data',
    },
    body: formData
  });
}


export async function uploadUserProfileImage(fileUri) {
  let url = SERVER_URL + "/user/profile/photo";
  await uploadImage(url, fileUri);
}


export async function getNews(offset) {
  let url = SERVER_URL + "/feed/";
  return await getResultByUrl(url, offset);
}

export async function getComments(eventId, offset) {
  let url = SERVER_URL + "/event/" + eventId + "/comment/";
  return await getResultByUrl(url, offset);
}

export async function sendComment(eventId, text) {
  let url = SERVER_URL + "/event/" + eventId + "/comment/";
  try {
    var res = await fetch(url,
      {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({text: text}),
      });
      return await res.json();
  } catch(error) {
    console.error(error);
  }
  return null;
}

export async function createEvent(event, eventId) {
  let url = SERVER_URL + "/event/";
  if (eventId)
    url += eventId + "/";
  try {
    var res = await fetch(url,
      {
        method: eventId ? "PATCH" : "POST",
        headers: HEADERS,
        body: JSON.stringify(event),
      });
      return await res.json();
  } catch(error) {
    console.error(error);
  }
  return null;
}

export async function uploadEventImage(eventId, fileUri) {
  let url = SERVER_URL + "/event/" + eventId + "/image_upload";
  await uploadImage(url, fileUri);
}

export async function logout() {
  let url = SERVER_URL + "/auth/logout";
  fetch(url,
    {
      headers: HEADERS,
    });
   HEADERS = new Headers();
}

export async function loginWithFb(token) {
  try {
    let response = await fetch(SERVER_URL + "/auth/facebook",
      {
        headers: {
          'Authorization': 'Bearer facebook ' + token
        },
      }
    );
    if (response.status > 200) return null;
    let responseJson = await response.json();
    return responseJson;
  } catch(error) {
    console.error(error);
  }
  return null;
}

export async function invite(userId, eventId) {
  let url = SERVER_URL + "/event/" + eventId + "/invite/" + userId;
  fetch(url,
    {
      method: "POST",
      headers: HEADERS,
    });
}


function updateSettings(url, param) {
  fetch(url,
    {
      method: "PATCH",
      headers: HEADERS,
      body: JSON.stringify(param),
    });
}
export function updateNotificationSettings(param) {
  let url = SERVER_URL + "/settings/notifications";
  updateSettings(url, param);
}


async function getSettings(url) {
  try {
    let response = await fetch(url, {
      headers: HEADERS,
    });
    return await response.json();
  } catch(error) {
    console.error(error);
  }
  return null;
}
export async function getNotificationSettings() {
  let url = SERVER_URL + "/settings/notifications";
  return getSettings(url);
}

export async function getPrivacySettings() {
  let url = SERVER_URL + "/settings/privacy";
  return getSettings(url);
}

export function updatePrivacySettings(param) {
  let url = SERVER_URL + "/settings/privacy";
  updateSettings(url, param);
}
