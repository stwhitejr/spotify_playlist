import React from 'react';
import { render } from 'react-dom'
// import { Provider } from 'react-redux';
// import { createStore } from 'redux';
// import reducers from './reducers';
import App from './components/App';

const spotifyApiRequest = () => {
  const myId = 1259501284;
  const playlistId = '6ceEv0hwgGEOGLFGv0ivw1';

  const access_token = 'BQCW98T_b-I7jLFiH25NrLVO-5potSCrnuE3Aqqj2ryDvmYzRmmD-mWjtbTn6HHcpRyEgpn_CqdGdQJwRG_crJei46AJlU6fSbQwXvgkT2sc4GNqhyef8S85677563h2ViwCOjmzo7ZWIFbzZxz60jlD9Vo2P12KVwQIAFYLkwhrCQtUURQqmEISgdVJSBM&refresh_token=AQDrpmO1R9o83rAE2QNiXiI_jR97d9HycNPF5JbDlH4LcSdEm8vWxJSt1bWqaW1Mh_YoL1W-eM2KLphFwdCWQkmpH6BERf4XQiobLY-D1eAqYmHJOb-Speus7qWjtJfYBHs';

  // If we have an access token move forward
  //TODO Load playlist selection page
  const config = {
    method: 'GET',
    headers: new Headers({
      'Authorization': 'Bearer ' + access_token
    })
  }
  fetch(`https://api.spotify.com/v1/users/${myId}/playlists/${playlistId}/tracks`, config).then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
  });
}

// let store = createStore(reducers);

// render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('root')
// )

const playlists = [{name: 'playlist', id:1}, {name:'playlist two', id:2}];
const playlistSongs = [{name: 'playlist song one', id:1}, {name:'playlist song two', id:2}];
const favSongs = [{name: 'song one', id:1}, {name:'song two', id:2}];
const favArtists = [{name: 'artist one', id:1}, {name:'artist two', id:2}];
render(
  <App playlists={playlists} favSongs={favSongs} favArtists={favArtists} selectedPlaylistSongs={playlistSongs} />,
  document.getElementById('root')
)