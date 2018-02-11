export const spotifyRequest = (path, method, accessToken, body, callback) => {
  const config = {
    method,
    headers: new Headers({
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }),
    body
  }
  fetch(`https://api.spotify.com/v1/${path}`, config).then((response) => {
    if (response.status === 200 || response.status === 201) {
      return response.json();
    } else if (response.status === 401) {
       window.location.assign('login.html');
    } else {
      return false;
    }
  }).then((json) => {
    if (json) {
      return callback(json);
    }
  });
}

export const spotifyRequestNext = (path, accessToken, items, callback) => {
  const config = {
    method: 'GET',
    headers: new Headers({
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    })
  }
  fetch(`https://api.spotify.com/v1/${path}`, config).then((response) => {
    if (response.status === 200 || response.status === 201) {
      return response.json();
    } else {
      return false;
    }
  }).then((json) => {
    if (json) {
      if (json.artists) {
        json = json.artists;
      }
      if (json.next) {
        items = items.concat(json.items);
        spotifyRequestNext(json.next.substring(27), accessToken, items, callback);
      } else {
        return callback(items);
      }
    }
  });
}
