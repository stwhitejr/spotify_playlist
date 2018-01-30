import React, { Component } from 'react';
import { connect } from 'react-redux'
import { choosePlaylist } from '../actions'
import ListPlaylists from '../components/ListPlaylists'
import Content from '../components/Content'

//TODO Get list of playlists from spotify API should be passed in as props from the component calling this container
const getPlaylists = [{name: 'test'}, { name: 'test two'}];

export class PlaylistMenu extends Component {
  render() {

    return (
      <div>
        <div className="playlist-menu">
          <div className="row">
            <div className="col-md-6">
              Choose a Playlist
            </div>
            <div className="col-md-6">
              <ListPlaylists playlists={getPlaylists} choosePlaylist={(e) => {this.props.choosePlaylist(e.target.value)}} />
            </div>
            {this.props.playlists.selected_playlist ?
              <div>Selected Playlist = {this.props.playlists.selected_playlist}</div> :
              <div>No playlist selected</div>
            }
          </div>
        </div>
        <div className="content">
          <Content playlistId={this.props.playlists.selected_playlist} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({  
  playlists: state.playlists,
});

const mapDispatchToProps = {
  choosePlaylist,
};

const Playlist = connect(  
  mapStateToProps,
  mapDispatchToProps
)(PlaylistMenu);

export default Playlist;  