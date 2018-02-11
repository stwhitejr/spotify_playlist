import React, { Component } from 'react';
import '../css/SongList.css';
//TODO Create a better play button
export class SongList extends Component {
  constructor() {
    super();
    this.state = {
      music: null
    }
    this.playMusic = this.playMusic.bind(this);
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
  listSongs() {
    if (this.props.songs) {
      return this.props.songs.map(song => {
        // User songs and search result songs get passed in differently
        const id = song.track ? song.track.id : song.id;
        const title = song.track ? song.track.name : song.name;
        const artist = song.track ? song.track.artists[0].name : song.artists[0].name;
        const preview = song.track ? song.track.preview_url : song.preview_url;
        let length = song.track ? song.track.duration_ms : song.duration_ms;
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
        return (
          <div className="SongList-row" key={id}>
            <div className={preview ? 'SongList-play' : 'SongList-playNoPreview'} onClick={e => preview ? this.playMusic(e, preview) : ''}></div>
            <div className="SongList-title" data-song-id={id} onClick={this.props.addSongToPlaylist}>{title}</div>
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