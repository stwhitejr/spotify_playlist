import React, { Component } from 'react';
import { spotifyRequest, spotifyRequestNext } from '../utility/Spotify.js';
import PlaylistMenu from './PlaylistMenu';
import ContentMenu from './ContentMenu';
import SongList from './SongList';
import ArtistList from './ArtistList';
import PropTypes from 'prop-types';
import '../css/App.css';

export class App extends Component {
  static propTypes = {
    accessToken: PropTypes.string.isRequired
  }
  state = {
    playlists: [],
    selectedPlaylist: '',
    selectedPlaylistSongs: '',
    userId: 1259501284,
    searchType: 'artist',
    searchQuery: ''
  }

  componentDidMount = () => {
    let fetchedData = {};
    // Get all playlists
    // Set first playlist as currently selected
    spotifyRequest(`users/${this.state.userId}/playlists`, 'GET', this.props.accessToken, null, (json) => {
      fetchedData.playlists = json.items;
      fetchedData.selectedPlaylist = json.items[0].id;
      Promise.all([
        // Get first playlist tracks
        new Promise((res) => {
          spotifyRequest(`users/${this.state.userId}/playlists/${fetchedData.selectedPlaylist}/tracks`, 'GET', this.props.accessToken, null, (json) => {
            fetchedData.selectedPlaylistSongs = json.items;
            res();
          });
        }),
        // Get user favorite songs
        new Promise((res) => {
            spotifyRequestNext(`me/tracks?limit=50`, this.props.accessToken, [], (json) => {
            fetchedData.songList = json;
            res();
          });
        }),
      ]).then(() => {
        this.setState(fetchedData);
      });
    });
  }
  setPlaylist = (e) => {
    const playlistId = e ? e.target.value : this.state.selectedPlaylist;
    spotifyRequest(`users/${this.state.userId}/playlists/${playlistId}/tracks`, 'GET', this.props.accessToken, null, (json) => {
      this.setState({
        selectedPlaylist: playlistId,
        selectedPlaylistSongs: json.items
      });
    });
  }
  addSongToPlaylist = (e) => {
    const song = e.target.getAttribute('data-track-id');
    spotifyRequest(`users/${this.state.userId}/playlists/${this.state.selectedPlaylist}/tracks?uris=spotify:track:${song}`, 'POST', this.props.accessToken, null, (json) => {
      spotifyRequest(`users/${this.state.userId}/playlists/${this.state.selectedPlaylist}/tracks`, 'GET', this.props.accessToken, null, (json) => {
        this.setState({selectedPlaylistSongs: json.items});
      });
    });
  }
  removeSongFromPlaylist = (e) => {
    const song = e.target.getAttribute('data-track-id'),
      data = {
        tracks: [{
          uri: `spotify:track:${song}`
        }]
      }
    spotifyRequest(`users/${this.state.userId}/playlists/${this.state.selectedPlaylist}/tracks`, 'DELETE', this.props.accessToken, JSON.stringify(data), (json) => {
      this.setPlaylist();
    });
  }
  setContentPage = (contentType) => {
    this.setState({contentType});
  }
  // Page Controllers
  setPageArtists = () => {
    // searchSong and searchArtist flags tell us whether or not we have search data or user data currently stored
    if (!this.state.artistList || this.state.searchArtist) {
      spotifyRequestNext(`me/following?type=artist&limit=50`, this.props.accessToken, [], (json) => {
        // Sort by A-Z
        json.sort((a,b) => {
          if (a.name.substring(0, 1) < b.name.substring(0, 1)) {
            return -1
          } else {
            return 1;
        }});
        this.setState({
          artistList: json,
          contentType: 'CONTENT_TYPE_ARTISTS',
          searchArtist: false,
          selectedArtist: null
        });
      });
    } else {
      this.setState({contentType: 'CONTENT_TYPE_ARTISTS', selectedArtist: null});
    }
  }
  setPageSongs = () => {
    if (!this.state.songList || this.state.searchSong) {
      spotifyRequestNext(`me/tracks?limit=50`, this.props.accessToken, [], (json) => {
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
  search = (e) => {
    const searchQuery = e.target.value;
    const sortByPopularity = (a, b) => {
      if (a.popularity > b.popularity) {
        return -1;
      } else {
        return 1;
      }
    }
    if (searchQuery !== '' && (e.keyCode === 13)) {
      spotifyRequest(`search?q=${searchQuery}&type=${this.state.searchType}&market=US`, 'GET', this.props.accessToken, null, (json) => {
        if (this.state.searchType === 'artist') {
          this.setState({
            artistList: json.artists.items.sort((a, b) => sortByPopularity(a, b)),
            contentType: 'CONTENT_TYPE_ARTISTS',
            searchArtist: true,
            selectedArtist: null,
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
  setSearchType = (e) => {
    const searchType = e.target.value;
    this.setState({searchType});
  }
  selectArtist = (e) => {
    const selectedArtistId = e.target.getAttribute('data-artist-id');
    let artistTopSongs,
      artistAlbums;
    const selectedArtist = this.state.artistList.find((artist) => artist.id === selectedArtistId);
    Promise.all([
      new Promise((res) => {
        spotifyRequest(`artists/${selectedArtistId}/top-tracks?country=US`, 'GET', this.props.accessToken, null, (json) => {
          artistTopSongs = json.tracks;
          res();
        });
      }),
      new Promise((res) => {
        spotifyRequest(`artists/${selectedArtistId}/albums`, 'GET', this.props.accessToken, null, (json) => {
          artistAlbums = json.items;
          res();
        });
      })
    ]).then(() => {
      Promise.all(artistAlbums.map((album, i) => {
        return new Promise((res) => {
          spotifyRequest(`albums/${album.id}/tracks`, 'GET', this.props.accessToken, null, (json) => {
            artistAlbums[i].songs = json.items;
            res();
          });
        })
      })).then(() => {
        artistAlbums = artistAlbums.filter(album => album.album_type !== 'single' && album.artists[0].id !== '0LyfQWJT6nXafLPZqxe9Of');
        this.setState(
          {
            selectedArtist,
            artistTopSongs,
            artistAlbums
          }
        );
      })
    });
  }
  addRandomSongs = () => {
    // Get top 2 songs
    const firstTwoTopSongs = this.state.artistTopSongs.reduce((acc, song, i) => {
      if (i === 0 || i === 1) {
        acc.push(song.id);
      }
      return acc;
    }, []);
    // Get all song IDs
    const allSongs = this.state.artistAlbums.reduce((acc = [], album) => {
      const songIds = album.songs.reduce((songAcc, song) => {
        if (firstTwoTopSongs.indexOf(song.id) === -1) {
          songAcc.push(song.id);
        }
        return songAcc;
      }, []);
      acc.push(songIds)
      return acc;
    }, []);
    // Flatten all songs
    const allSongsMerged = [].concat.apply([], allSongs);
    // Randomly sort the songs
    allSongsMerged.sort((a,b) => 0.5 - Math.random());
    const finalSongs = [...firstTwoTopSongs, allSongsMerged[0], allSongsMerged[1], allSongsMerged[2]];;
    const trackURI = finalSongs.map(song => `spotify:track:${song}`);
    spotifyRequest(`users/${this.state.userId}/playlists/${this.state.selectedPlaylist}/tracks?uris=${trackURI.join()}`, 'POST', this.props.accessToken, null, (json) => {
      spotifyRequest(`users/${this.state.userId}/playlists/${this.state.selectedPlaylist}/tracks`, 'GET', this.props.accessToken, null, (json) => {
        this.setState({selectedPlaylistSongs: json.items});
      });
    });
  }
  renderContent = () => {
    switch(this.state.contentType) {
      case 'CONTENT_TYPE_ARTISTS':
        return (
          <ArtistList selectedArtist={this.state.selectedArtist} artistTopSongs={this.state.artistTopSongs} artistAlbums={this.state.artistAlbums} selectArtist={this.selectArtist} artists={this.state.artistList} fromSearch={this.state.searchArtist} accessToken={this.props.accessToken} addSongToPlaylist={this.addSongToPlaylist} addRandomSongs={this.addRandomSongs} />
        )
      default:
        return (
          <SongList songs={this.state.songList} addSongToPlaylist={this.addSongToPlaylist} />
      )
    }
  }
  render() {
    return (
      <div className="Container">
        <PlaylistMenu playlists={this.state.playlists} selectPlaylist={this.setPlaylist} songs={this.state.selectedPlaylistSongs} removeSong={this.removeSongFromPlaylist} />
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