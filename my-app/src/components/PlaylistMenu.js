import React, { Component } from 'react';

export class PlaylistMenu extends Component {
  render() {
    return (
      <div>
      Choose Playlist:
        <select onChange={this.props.selectPlaylist}>
          {this.props.playlists ?
            this.props.playlists.map((playlist) => {
            return <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
            }) : ''
          }
        </select>
      </div>
    )
  }
}

export default PlaylistMenu;