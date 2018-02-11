import React, { Component } from 'react';
import { spotifyRequest } from '../utility/Spotify.js';
import '../css/ArtistList.css';

export class ArtistList extends Component {
  constructor(props) {
    super(props);
    let sortedArtists = props.artists;
    if (!props.fromSearch) {
      sortedArtists.sort((a,b) => {
        if (a.name.substring(0, 1) < b.name.substring(0, 1)) {
          return -1
        } else {
          return 1;
      }})
    }
    this.state = {
      artists: sortedArtists,
      selectedArtist: null,
      accessToken: props.accessToken,
      fromSearch: props.fromSearch,
      music: null
    }
    this.selectArtist = this.selectArtist.bind(this);
    this.playMusic = this.playMusic.bind(this);
  }
  selectArtist(e) {
    const selectedArtistId = e.target.getAttribute('data-artist-id');
    let artistTopSongs,
      artistAlbums;
    const selectedArtist = this.state.artists.find((artist) => artist.id === selectedArtistId);
    Promise.all([
      new Promise((res) => {
        spotifyRequest(`artists/${selectedArtistId}/top-tracks?country=US`, 'GET', this.state.accessToken, null, (json) => {
          artistTopSongs = json.tracks;
          res();
        });
      }),
      new Promise((res) => {
        spotifyRequest(`artists/${selectedArtistId}/albums`, 'GET', this.state.accessToken, null, (json) => {
          artistAlbums = json.items;
          res();
        });
      })
    ]).then(() => {
      Promise.all(artistAlbums.map((album, i) => {
        return new Promise((res) => {
          spotifyRequest(`albums/${album.id}/tracks`, 'GET', this.state.accessToken, null, (json) => {
            artistAlbums[i].songs = json.items;
            res();
          });
        })
      })).then(() => {
        console.log(artistAlbums);
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
  playMusic(e, song) {
    const button = e.target;
    if (this.state.music === null) {
      this.state.music = new Audio(song);
      this.state.music.play();
    } else {
      this.state.music.pause();
      this.setState({music:null});
    }
  }
  render() {
    return (
      <div>
      <h4 onClick={(e) => this.setState({selectedArtist: null})}>Artists</h4>
        {this.state.selectedArtist ? <ArtistPage artists={this.state.artists} artist={this.state.selectedArtist} addSongToPlaylist={this.props.addSongToPlaylist} topSongs={this.state.artistTopSongs} albums={this.state.artistAlbums} playMusic={this.playMusic} />:<ArtistListSub artists={this.state.artists} selectArtist={this.selectArtist} />}
      </div>
    )
  }
}

const ArtistListSub = (props) => (
  <div className="ArtistList">
    {props.artists.map(artist => {
      return (<div className="ArtistList-item" key={artist.id} onClick={props.selectArtist} data-artist-name={artist.name} data-artist-id={artist.id}>
        <img src={artist.images.length > 0 ? artist.images[0].url : ''} alt={artist.name} className="ArtistList-image" data-artist-id={artist.id} />
        {artist.name}
      </div>)
    }
  )}
  </div>
)
const ArtistPage = (props) => {
  const msToTime = (s) => {
    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    secs = secs.toString();
    secs = secs.length === 1 ? `${secs}0` : secs;
    return mins + ':' + secs;
  }
  return(
    <div className="ArtistPage">
      <div className="ArtistPage-info">
        {props.artist.images.length > 0 ? <img src={props.artist.images[0].url} className="ArtistPage-image" /> : ''}
        <div className="ArtistPageTopTracks">
          <div className="ArtistPageTopTracks-header">
            {props.artist.name}
          </div>
          <div className="ArtistPageTopTracks-list">
            {props.topSongs.map(track => <span className="ArtistPageTopTracks-item" onClick={props.addSongToPlaylist} key={track.id} data-track-id={track.id}>{track.name}</span>)}
          </div>
        </div>
      </div>
      <div className="ArtistPageAlbums">
        {props.albums.map((album) => {
          return(
            <div className="ArtistPageAlbums-item" key={album.id}>
              <img src={album.images[0].url} className="ArtistPageAlbums-image" />
              <div className="ArtistPageAlbums-content">
                <div className="ArtistPageAlbums-header">
                  {album.name}
                </div>
                <div className="ArtistPageAlbumsSongs">
                  {album.songs ? album.songs.map((song) => {
                    return(
                      <div className="ArtistPageAlbumsSongs-row" key={song.id}>
                        <div className={song.preview_url ? 'ArtistPageAlbumsSongs-play' : 'ArtistPageAlbumsSongs-playNoPreview'} onClick={e => song.preview_url ? props.playMusic(e, song.preview_url) : ''}>
                        </div>
                        <div className="ArtistPageAlbumsSongs-title" onClick={props.addSongToPlaylist} data-track-id={song.id}>
                          {song.name}
                        </div>
                        <div className="ArtistPageAlbumsSongs-length">
                          {msToTime(song.duration_ms)}
                        </div>
                      </div>
                    )
                  }) : ''}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ArtistList;