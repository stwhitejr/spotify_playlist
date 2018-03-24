import React from 'react';
import PropTypes from 'prop-types';
import '../css/PlaylistMenu.css';

const PlaylistMenu = (props) => (
  <div className="PlaylistMenu">
    <section>
      <div className="PlaylistMenu-header">Choose Playlist:</div>
      <select className="PlaylistMenu-select" onChange={props.selectPlaylist}>
        {props.playlists ?
          props.playlists.map((playlist) => {
          return <option className="PlaylistMenu-option" key={playlist.id} value={playlist.id}>{playlist.name}</option>
          }) : ''
        }
      </select>
    </section>
    <section className="PlayListMenuSongs">
      <div className="PlaylistMenu-header">Playlist Songs</div>
      <div className="PlaylistMenuSongs">
        {props.songs.length > 0 ?
          props.songs.map(song => <div className="PlaylistMenuSongs-song" key={song.track.id} data-track-id={song.track.id} onClick={props.removeSong}>{song.track.artists[0].name} - {song.track.name}</div>) : ''
        }
      </div>
    </section>
  </div>
)
PlaylistMenu.propTypes = {
  selectPlaylist: PropTypes.func.isRequired,
  playlists: PropTypes.array.isRequired,
  songs: PropTypes.array.isRequired,
  removeSong: PropTypes.func.isRequired
}

export default PlaylistMenu;