import React, { Component } from 'react';

export class PlaylistSongs extends Component {
  render() {
    return (
      <div>
        <h1>Playlist Songs</h1>
        {this.props.songs.map(song => <div key={song.id}>{song.name}</div>)}
      </div>
    )
  }
}

export default PlaylistSongs;