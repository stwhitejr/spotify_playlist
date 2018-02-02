import React, { Component } from 'react';

export class FavSongs extends Component {
  render() {
    return (
      <div className="FavSongs">
        <div>
          <h1>Add songs to playlist</h1>
          {this.props.favSongs ?
            this.props.favSongs.map(song => <div key={song.track.id} data-song-id={song.track.id} onClick={this.props.addSongToPlaylist}>
              {song.track.artists[0].name} - {song.track.name}</div>) : ''
          }
        </div>
      </div>
    )
  }
}

export default FavSongs;