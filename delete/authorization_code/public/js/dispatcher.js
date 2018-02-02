/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

//TODO These will be populated when we login/select a playlist
const myId = 1259501284;
const playlistId = '6ceEv0hwgGEOGLFGv0ivw1';

var params = getHashParams();
console.log(params);

var access_token = params.access_token,
    refresh_token = params.refresh_token,
    error = params.error;

var oauthSource = document.getElementById('oauth-template').innerHTML,
    oauthTemplate = Handlebars.compile(oauthSource),
    oauthPlaceholder = document.getElementById('oauth');

if (error) {
  alert('There was an error during the authentication');
  throw error;
} else {
  if (access_token) {
    // If we have an access token move forward
    //TODO Load playlist selection page
    document.getElementById('login').style.display = 'none';
    document.getElementById('loggedin').style.display = 'block';
    oauthPlaceholder.innerHTML = oauthTemplate({
      access_token: access_token,
      refresh_token: refresh_token
    });
    // $.ajax({
    //     url: `https://api.spotify.com/v1/users/${myId}/playlists/${playlistId}/tracks`,
    //     headers: {
    //       'Authorization': 'Bearer ' + access_token
    //     },
    //     success: function(response) {
    //       console.log(response);
    //       userPlaylistPlaceholder.innerHTML = userPlaylistTemplate(response);

    //       $('#login').hide();
    //       $('#loggedin').show();
    //     }
    // });
  } else {
      // render initial login page
      document.getElementById('login').style.display = 'block';
      document.getElementById('loggedin').style.display = 'none';
  }
}