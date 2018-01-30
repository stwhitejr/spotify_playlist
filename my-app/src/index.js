import React from 'react';
import { render } from 'react-dom'
// import { Provider } from 'react-redux';
// import { createStore } from 'redux';
// import reducers from './reducers';
import App from './components/App';

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