import React, { Component } from 'react';
import PlaylistMenu from './PlaylistMenu';
import AddToPlaylist from './AddToPlaylist';

const spotifyRequest = (path, method, accessToken, body, callback) => {
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
    } else {
      return false;
    }
  }).then((json) => {
    if (json) {
      return callback(json);
    }
  });
}

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: '',
      selected_playlist: '',
      selected_playlist_songs: '',
      fav_songs: '',
      fav_artists: '',
      access_token: props.accessToken,
      user_id: 1259501284
    }
  }
  componentDidMount() {
    const playlistId = '6ceEv0hwgGEOGLFGv0ivw1';

    let fetchedData = {};
    // Get all playlists
    // Set first playlist as currently selected
    spotifyRequest(`users/${this.state.user_id}/playlists`, 'GET', this.state.access_token, null, (json) => {
      fetchedData.playlists = json.items;
      fetchedData.selected_playlist = json.items[0];
      Promise.all([
        // Get first playlist tracks
        new Promise((res) => {
          spotifyRequest(`users/${this.state.user_id}/playlists/${playlistId}/tracks`, 'GET', this.state.access_token, null, (json) => {
            fetchedData.selected_playlist_songs = json.items;
            res();
          });
        }),
        // Get user favorite songs
        //TODO We need paginiation or something here. We should be able to access the next property off the request to continue requesting all of the songs
        new Promise((res) => {
            spotifyRequest(`me/tracks?limit=50`, 'GET', this.state.access_token, null, (json) => {
            fetchedData.fav_songs = json.items;
            res();
          });
        }),
        // Get user favorite artists
        //TODO We need paginiation or something here. We should be able to access the next property off the request to continue requesting all of the songs
        new Promise((res) => {
          spotifyRequest(`me/following?type=artist&limit=50`, 'GET', this.state.access_token, null, (json) => {
            console.log(json);
            fetchedData.fav_artists = json.artists.items;
            res();
          });
        }),
      ]).then(() => {
        this.setState(fetchedData);
      });
    });
  }
  setPlaylist(id) {
    const selectedPlaylist = this.state.playlists.find(playlist => playlist.id === id);
    spotifyRequest(`users/${this.state.user_id}/playlists/${selectedPlaylist.id}/tracks`, 'GET', this.state.access_token, null, (json) => {
      this.setState({
        selected_playlist: selectedPlaylist,
        selected_playlist_songs: json.items
      });
    });
  }
  addSongToPlaylist(song) {
    spotifyRequest(`users/${this.state.user_id}/playlists/${this.state.selected_playlist.id}/tracks?uris=spotify:track:${song}`, 'POST', this.state.access_token, null, (json) => {
      spotifyRequest(`users/${this.state.user_id}/playlists/${this.state.selected_playlist.id}/tracks`, 'GET', this.state.access_token, null, (json) => {
        this.setState({selected_playlist_songs: json.items});
      });
    });
  }
  removeSongFromPlaylist(song) {
    const data = {
      tracks: [{
        uri: `spotify:track:${song}`
      }]
    }
    spotifyRequest(`users/${this.state.user_id}/playlists/${this.state.selected_playlist.id}/tracks`, 'DELETE', this.state.access_token, JSON.stringify(data), (json) => {
      this.setPlaylist(this.state.selected_playlist.id);
    });
  }
  render() {
    return (
      <div className="container">
        <PlaylistMenu playlists={this.state.playlists} selectPlaylist={(e) => {this.setPlaylist(e.target.value)}} songs={this.state.selected_playlist_songs} removeSong={(e) => this.removeSongFromPlaylist(e.target.getAttribute('data-song-id'))} />
        <AddToPlaylist favSongs={this.state.fav_songs} favArtists={this.state.fav_artists} addSongToPlaylist={(e) => {this.addSongToPlaylist(e.target.getAttribute('data-song-id'))}} />
      </div>
    )
  }
}

export default App;