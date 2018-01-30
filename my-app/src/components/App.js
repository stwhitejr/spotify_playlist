import React, { Component } from 'react';
import PlaylistMenu from './PlaylistMenu';
import PlaylistSongs from './PlaylistSongs';
import AddToPlaylist from './AddToPlaylist';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: props.playlists,
      selected_playlist: props.playlists[0],
      selected_playlist_songs: props.selectedPlaylistSongs,
      fav_songs: props.favSongs,
      fav_artists: props.favArtists
    }
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