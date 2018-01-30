import React from 'react'
import { connect } from 'react-redux'
import { displayPlaylists } from '../actions'
import { choosePlaylist } from '../actions'

let AppComponent = (props) => {
  const playlistJson = [
    {
      name: 'test',
      id: 1
    },
    {
      name: 'plaulist2',
      id: 2
    }
  ]
  let playlistResults = '';
      console.log(props.playlist);
  if (props.playlists.length > 0) {
    props.playlists.forEach(playlist => {
      playlistResults += playlist.name;
    })
  } else {
    playlistResults = 'no playlists';
  }
  console.log(props);

  return (
    <div>
      <button onClick={e=> {
        props.displayPlaylists(playlistJson)
      }}>Show Playlists</button>
      {playlistResults}
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({  
  playlists: state.playlists
});

const mapDispatchToProps = {  
  displayPlaylists,
  choosePlaylist,
};

const ShowPlaylists = connect(  
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);

export default ShowPlaylists;  