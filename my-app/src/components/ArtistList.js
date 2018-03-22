import React, { Component } from 'react';
import { spotifyRequest } from '../utility/Spotify.js';
import PropTypes from 'prop-types';
import '../css/ArtistList.css';

export class ArtistList extends Component {
  static propTypes = {
    artists: PropTypes.array.isRequired,
    accessToken: PropTypes.string.isRequired,
    addSongToPlaylist: PropTypes.func.isRequired,
    selectArtist: PropTypes.func.isRequired,
    selectedArtist: PropTypes.object,
    artistAlbums: PropTypes.array,
    artistTopSongs: PropTypes.array,
    addRandomSongs: PropTypes.func.isRequired
  }
  state = {
    music: null
  }

  playMusic = (e, song) => {
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
      <h4>Artists</h4>
        {this.props.selectedArtist ? <ArtistPage artists={this.props.artists} artist={this.props.selectedArtist} addSongToPlaylist={this.props.addSongToPlaylist} topSongs={this.props.artistTopSongs} albums={this.props.artistAlbums} playMusic={this.playMusic} addRandomSongs={this.props.addRandomSongs} />:<ArtistListSub artists={this.props.artists} selectArtist={this.props.selectArtist} />}
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
ArtistListSub.propTypes = {
  artists: PropTypes.array.isRequired,
  selectArtist: PropTypes.func.isRequired,
  addRandomSongs: PropTypes.func.isRequired
}
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
            {props.artist.name} <span onClick={props.addRandomSongs}>Add Random Songs</span>
          </div>
          <div className="ArtistPageTopTracks-list">
            {props.topSongs.map(track => (
              <div className="ArtistPageTopTracks-item">
                {track.preview_url && (<span onClick={e => props.playMusic(e, track.preview_url)}>&#128264;</span>)}
                <span onClick={props.addSongToPlaylist} key={track.id} data-track-id={track.id}>{track.name}</span>
              </div>
            ))}
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
ArtistPage.propTypes = {
  artist: PropTypes.object.isRequired,
  albums: PropTypes.array.isRequired,
  topSongs: PropTypes.array.isRequired,
  addSongToPlaylist: PropTypes.func.isRequired
}

export default ArtistList;