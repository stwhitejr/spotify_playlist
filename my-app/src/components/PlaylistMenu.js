import React, { Component } from 'react';

export class PlaylistMenu extends Component {
  render() {
    return (
      <div className="PlaylistMenu">
        <span className="PlaylistMenu-header">Choose Playlist:</span>
        <select className="PlaylistMenu-select" onChange={this.props.selectPlaylist}>
          {this.props.playlists ?
            this.props.playlists.map((playlist) => {
            return <option className="PlaylistMenu-option" key={playlist.id} value={playlist.id}>{playlist.name}</option>
            }) : ''
          }
        </select>
        <div className="PlaylistMenuSongs">
          <span className="PlaylistMenu-header">Playlist Songs</span>
          <div class="PlaylistMenuSongs-content">
            {this.props.songs ?
              this.props.songs.map(song => <div className="PlaylistMenuSongs-song" key={song.track.id} data-song-id={song.track.id} onClick={this.props.removeSong}>{song.track.artists[0].name} - {song.track.name}</div>) : ''
            }
          </div>
        </div>
      </div>
    )
  }
}

export default PlaylistMenu;