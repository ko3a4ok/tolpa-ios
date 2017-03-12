const SERVER_URL = "https://meethere-dev.herokuapp.com";
// SERVER_URL = "http://10.0.0.113:8000";
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

export async function searchEventsByText(text, offset) {
  let url = SERVER_URL + "/search/all/?q=" + text;
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
    let responseJson = await response.json();
    return responseJson;
  } catch(error) {
    console.error(error);
  }
  return null;
}


async function uploadImage(url, fileUri) {
  var formData  = new FormData();
  formData.append('file', {uri: fileUri, name: 'file'} );
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
