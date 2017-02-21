const SERVER_URL = "https://meethere-dev.herokuapp.com";

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
    let response = await fetch(SERVER_URL +"/auth/email/check?email=" + email);
    let responseJson = await response.json();
    return responseJson.registered;
  } catch(error) {
    console.error(error);
  }
  return true;
}
