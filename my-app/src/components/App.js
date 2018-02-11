import React, { Component } from 'react';
import { spotifyRequest, spotifyRequestNext } from '../utility/Spotify.js';
import PlaylistMenu from './PlaylistMenu';
import ContentMenu from './ContentMenu';
import SongList from './SongList';
import ArtistList from './ArtistList';
import '../css/App.css';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      selectedPlaylist: '',
      selectedPlaylistSongs: '',
      accessToken: props.accessToken,
      userId: 1259501284,
      searchType: 'artist',
      searchQuery: ''
    }
    this.setPageArtists = this.setPageArtists.bind(this);
    this.setPageSongs = this.setPageSongs.bind(this);
    this.search = this.search.bind(this);
    this.setSearchType = this.setSearchType.bind(this);
  }
  componentDidMount() {
    const playlistId = '6ceEv0hwgGEOGLFGv0ivw1';

    let fetchedData = {};
    // Get all playlists
    // Set first playlist as currently selected
    spotifyRequest(`users/${this.state.userId}/playlists`, 'GET', this.state.accessToken, null, (json) => {
      fetchedData.playlists = json.items;
      fetchedData.selectedPlaylist = json.items[0];
      Promise.all([
        // Get first playlist tracks
        new Promise((res) => {
          spotifyRequest(`users/${this.state.userId}/playlists/${playlistId}/tracks`, 'GET', this.state.accessToken, null, (json) => {
            fetchedData.selectedPlaylistSongs = json.items;
            res();
          });
        }),
        // Get user favorite songs
        new Promise((res) => {
            spotifyRequestNext(`me/tracks?limit=50`, this.state.accessToken, [], (json) => {
            fetchedData.songList = json;
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
    spotifyRequest(`users/${this.state.userId}/playlists/${selectedPlaylist.id}/tracks`, 'GET', this.state.accessToken, null, (json) => {
      this.setState({
        selectedPlaylist: selectedPlaylist,
        selectedPlaylistSongs: json.items
      });
    });
  }
  addSongToPlaylist(song) {
    spotifyRequest(`users/${this.state.userId}/playlists/${this.state.selectedPlaylist.id}/tracks?uris=spotify:track:${song}`, 'POST', this.state.accessToken, null, (json) => {
      spotifyRequest(`users/${this.state.userId}/playlists/${this.state.selectedPlaylist.id}/tracks`, 'GET', this.state.accessToken, null, (json) => {
        this.setState({selectedPlaylistSongs: json.items});
      });
    });
  }
  removeSongFromPlaylist(song) {
    const data = {
      tracks: [{
        uri: `spotify:track:${song}`
      }]
    }
    spotifyRequest(`users/${this.state.userId}/playlists/${this.state.selectedPlaylist.id}/tracks`, 'DELETE', this.state.accessToken, JSON.stringify(data), (json) => {
      this.setPlaylist(this.state.selectedPlaylist.id);
    });
  }
  //TODO create a function for each page type and set you onClicks to that one function. Do all changes + state there
  setContentPage(contentType) {
    this.setState({contentType});
  }
  // Page Controllers
  setPageArtists(e) {
    // searchSong and searchArtist flags tell us whether or not we have search data or user data currently stored
    if (!this.state.artistList || this.state.searchArtist) {
      spotifyRequestNext(`me/following?type=artist&limit=50`, this.state.accessToken, [], (json) => {
        this.setState({
          artistList: json,
          contentType: 'CONTENT_TYPE_ARTISTS',
          searchArtist: false
        });
      });
    } else {
      this.setState({contentType: 'CONTENT_TYPE_ARTISTS'});
    }
  }
  setPageSongs() {
    if (!this.state.songList || this.state.searchSong) {
      spotifyRequestNext(`me/tracks?limit=50`, this.state.accessToken, [], (json) => {
        this.setState({
          songList: json,
          contentType: 'CONTENT_TYPE_SONGS',
          searchSong: false
        });
      });
    } else {
      this.setState({contentType: 'CONTENT_TYPE_SONGS'});
    }
  }
  //TODO clean up these addSongToPlaylist functions
  renderContent() {
    switch(this.state.contentType) {
      case 'CONTENT_TYPE_ARTISTS':
        return (
          <ArtistList artists={this.state.artistList} fromSearch={this.state.searchArtist} accessToken={this.state.accessToken} addSongToPlaylist={(e) => {this.addSongToPlaylist(e.target.getAttribute('data-track-id'))}} />
      )
      default:
        return (
          <SongList songs={this.state.songList} addSongToPlaylist={(e) => {this.addSongToPlaylist(e.target.getAttribute('data-song-id'))}} />
      )
    }
  }
  search(e) {
    const searchQuery = e.target.value;
    const sortByPopularity = (a, b) => {
      if (a.popularity > b.popularity) {
        return -1;
      } else {
        return 1;
      }
    }
    if (searchQuery !== '' && (e.keyCode === 13)) {
      spotifyRequest(`search?q=${searchQuery}&type=${this.state.searchType}&market=US`, 'GET', this.state.accessToken, null, (json) => {
        console.log(json)
        if (this.state.searchType === 'artist') {
          this.setState({
            artistList: json.artists.items.sort((a, b) => sortByPopularity(a, b)),
            contentType: 'CONTENT_TYPE_ARTISTS',
            searchArtist: true,
            searchQuery
          });
        } else {
          this.setState({
            songList: json.tracks.items.sort((a, b) => sortByPopularity(a, b)),
            contentType: 'CONTENT_TYPE_SONGS',
            searchSong: true,
            searchQuery
          });
        }
      });
    }
  }
  setSearchType(e) {
    const searchType = e.target.value;
    this.setState({searchType});
  }
  render() {
    return (
      <div className="Container">
        <PlaylistMenu playlists={this.state.playlists} selectPlaylist={(e) => {this.setPlaylist(e.target.value)}} selectedPlaylist={this.state.selectedPlaylist} songs={this.state.selectedPlaylistSongs} removeSong={(e) => this.removeSongFromPlaylist(e.target.getAttribute('data-song-id'))} />
        <div className="ContentBox">
          <ContentMenu setPageSongs={this.setPageSongs} setPageArtists={this.setPageArtists} search={this.search} setSearchType={this.setSearchType} />
          <div className="ContentBox-inner">
            {this.renderContent()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;