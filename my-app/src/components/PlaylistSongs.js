import React, { Component } from 'react';

export class PlaylistSongs extends Component {
  render() {
    return (
      <div>
        <h1>Playlist Songs</h1>
        {this.props.songs ?
          this.props.songs.map(song => <div key={song.track.id} data-song-id={song.track.id} onClick={this.props.removeSong}>{song.track.name}</div>) : ''
        }
      </div>
    )
  }
}

export default PlaylistSongs;