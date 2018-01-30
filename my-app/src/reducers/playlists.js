const playlists = (state = [], action) => {
  switch (action.type) {
    case 'CHOOSE_PLAYLIST':
      return { ...state, selected_playlist: action.playlist }
    default:
      return state
  }
}

export default playlists;