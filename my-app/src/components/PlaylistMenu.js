import React, { Component } from 'react';
import '../css/PlaylistMenu.css';

export class PlaylistMenu extends Component {
  render() {
    return (
      <div className="PlaylistMenu">
        <section>
          <div className="PlaylistMenu-header">Choose Playlist:</div>
          <select className="PlaylistMenu-select" onChange={this.props.selectPlaylist}>
            {this.props.playlists ?
              this.props.playlists.map((playlist) => {
              return <option className="PlaylistMenu-option" key={playlist.id} value={playlist.id}>{playlist.name}</option>
              }) : ''
            }
          </select>
        </section>
        <section>
          <span className="PlaylistMenu-header">Selected Playlist:</span> {this.props.selectedPlaylist.name}
        </section>
        <section className="PlayListMenuSongs">
          <div className="PlaylistMenu-header">Playlist Songs</div>
          <div className="PlaylistMenuSongs">
            {this.props.songs ?
              this.props.songs.map(song => <div className="PlaylistMenuSongs-song" key={song.track.id} data-song-id={song.track.id} onClick={this.props.removeSong}>{song.track.artists[0].name} - {song.track.name}</div>) : ''
            }
          </div>
        </section>
      </div>
    )
  }
}

export default PlaylistMenu;