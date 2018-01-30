import React, { Component } from 'react';
import PlaylistMenu from './PlaylistMenu';
import PlaylistSongs from './PlaylistSongs';
import AddToPlaylist from './AddToPlaylist';

const spotifyApiRequest = () => {
  
}

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: '',
      selected_playlist: '',
      selected_playlist_songs: '',
      fav_songs: '',
      fav_artists: ''
    }
  }
  componentDidMount() {
    const myId = 1259501284;
    const playlistId = '6ceEv0hwgGEOGLFGv0ivw1';

    const access_token = 'BQB-MV0zKz_BnlpFIvrNTHMk9Gz-QbeI1QHYlTnwEiCX8DVkMGbq53N29VJekdDG5pGk-uw8ffIOaEOVGkDk4xGPvfrtc7bFOxE_nqGkcyKIRDqFPg-Kml7_izQH2_JlVW2bVQLlPeNH29UecAz8RkFWzl6thhzqxL8escrOyRoXtmJKdsCK5rwswBtZlHY&refresh_token=AQC3PCcQgU4onI3fFcLyYDB36m4r_m5L2xhJ9572fW8dJEbJTEyS5ED09sweTJH5RzmBNG0ZjLCByG_tDJht4_f5wSJH0Pb4hE6sx-7Tq9a2Hd4Pl4gR0VcBTIL8Y5wQSSU';

    // If we have an access token move forward
    //TODO Load playlist selection page
    const config = {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Bearer ' + access_token
      })
    }
    let fetchedData = {};
    Promise.all([
      // Get all playlists
      // Set first playlist as currently selected
      //TODO fetch this first then chain all the rest
      fetch(`https://api.spotify.com/v1/users/${myId}/playlists`, config).then((response) => {
        return response.json();
      }).then((json) => {
        fetchedData.playlists = json.items;
        fetchedData.selected_playlist = json.items[0];
      }),
      // Get first playlist tracks
      fetch(`https://api.spotify.com/v1/users/${myId}/playlists/${playlistId}/tracks`, config).then((response) => {
        return response.json();
      }).then((json) => {
        fetchedData.selected_playlist_songs = json.items;
      }),
      // Get user favorite songs
      fetch(`https://api.spotify.com/v1/me/tracks`, config).then((response) => {
        return response.json();
      }).then((json) => {
        fetchedData.fav_songs = json.items;
      }),
      // Get user favorite artists
      fetch(`https://api.spotify.com/v1/me/following?type=artist`, config).then((response) => {
        return response.json();
      }).then((json) => {
        fetchedData.fav_artists = json.items;
      })
      ]
    ).then(() => {
      this.setState(fetchedData);
    });
  }
  setPlaylist(id) {
    const selectedPlaylist = this.state.playlists.find(playlist => playlist.id === parseInt(id));
    this.setState({selected_playlist: selectedPlaylist});
  }
  addSongToPlaylist(song) {
    //TODO add song to selected playlist
    console.log(song);
  }
  render() {
    return (
      <div className="container">
        <PlaylistMenu playlists={this.state.playlists} selectPlaylist={(e) => {this.setPlaylist(e.target.value)}} />
        <PlaylistSongs songs={this.state.selected_playlist_songs} />
        <AddToPlaylist favSongs={this.state.fav_songs} favArtists={this.state.favArtists} addSongToPlaylist={(e) => {this.addSongToPlaylist(e.target.getAttribute('data-song-id'))}} />
      </div>
    )
  }
}

export default App;