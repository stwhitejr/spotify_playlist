import React, { Component } from 'react';

export class PlaylistSongs extends Component {
  render() {
    console.log(this.props.songs)
    return (
      <div>
        <h1>Playlist Songs</h1>
        {this.props.songs ?
          this.props.songs.map(song => <div key={song.track.id}>{song.track.name}</div>) : ''
        }
      </div>
    )
  }
}

export default PlaylistSongs;