import React, { Component } from 'react';

export class AddToPlaylist extends Component {
  render() {
    return (
      <div>
        <h1>Add songs to playlist</h1>
        {this.props.favSongs ? 
          this.props.favSongs.map(song => <div key={song.id} data-song-id={song.id} onClick={this.props.addSongToPlaylist}>{song.name}</div>) : ''
        }
      </div>
    )
  }
}

export default AddToPlaylist;