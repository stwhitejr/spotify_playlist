import React, { Component } from 'react';

export class AddToPlaylist extends Component {
  render() {
    return (
      <div>
        <div>
          <h1>Add songs to playlist</h1>
          {this.props.favSongs ?
            this.props.favSongs.map(song => <div key={song.track.id} data-song-id={song.track.id} onClick={this.props.addSongToPlaylist}>{song.track.name}</div>) : ''
          }
        </div>
        <div>
          <h1>Artists</h1>
          {this.props.favArtists ?
            this.props.favArtists.map(artist => <div key={artist.id}>{artist.name}</div>) : ''
          }
        </div>
      </div>
    )
  }
}

export default AddToPlaylist;