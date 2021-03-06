import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/SongList.css';
//TODO Create a better play button
export class SongList extends Component {
  static propTypes = {
    songs: PropTypes.array.isRequired,
    addSongToPlaylist: PropTypes.func.isRequired
  }
  music = {
    player: null
  }
  playMusic = (song) => {
    if (this.music.player === null) {
      this.music.player = new Audio(song);
      this.music.player.play();
    } else {
      this.music.player.pause();
      this.music.player = null;
    }
  }
  listSongs = () => {
    if (this.props.songs.length > 0) {
      return this.props.songs.map(song => {
        // User songs and search result songs get passed in differently
        const id = song.track ? song.track.id : song.id,
          title = song.track ? song.track.name : song.name,
          artist = song.track ? song.track.artists[0].name : song.artists[0].name,
          preview = song.track ? song.track.preview_url : song.preview_url,
          length = song.track ? song.track.duration_ms : song.duration_ms;
        const msToTime = (s) => {
          const ms = s % 1000;
          s = (s - ms) / 1000;
          let secs = s % 60;
          s = (s - secs) / 60;
          const mins = s % 60;
          secs = secs.toString();
          secs = secs.length === 1 ? `${secs}0` : secs;
          return mins + ':' + secs;
        }
        return (
          <div className="SongList-row" key={id}>
            <div className={preview ? 'SongList-play' : 'SongList-playNoPreview'} onClick={e => preview ? this.playMusic(preview) : ''}></div>
            <div className="SongList-title" data-track-id={id} onClick={this.props.addSongToPlaylist}>{title}</div>
            <div className="SongList-artist">{artist}</div>
            <div className="SongList-length">{msToTime(length)}</div>
          </div>
        )
      })
    }
  }
  render() {
    return (
      <div className="SongList">
        <div className="SongList-row">
          <div className="SongList-play">
            Play
          </div>
          <div className="SongList-title">
            Title
          </div>
          <div className="SongList-artist">
            Artist
          </div>
          <div className="SongList-length">
            Length
          </div>
        </div>
        {this.listSongs()}
      </div>
    )
  }
}

export default SongList;