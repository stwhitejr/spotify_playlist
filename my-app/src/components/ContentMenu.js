import React from 'react';
import PropTypes from 'prop-types';
import '../css/ContentMenu.css';

const ContentMenu = (props) => (
  <div className="ContentMenu">
    <div className={props.contentType === 'CONTENT_TYPE_SONGS' && !props.searchQuery ? 'ContentMenu-button ContentMenu-button--active' : 'ContentMenu-button'} onClick={props.setPageSongs}>
      Favorite Songs
    </div>
    <div className={props.contentType === 'CONTENT_TYPE_ARTISTS' && !props.searchQuery ? 'ContentMenu-button ContentMenu-button--active' : 'ContentMenu-button'} onClick={props.setPageArtists}>
      Favorite Artists
    </div>
    <div className={props.searchQuery ? 'ContentMenu-search ContentMenu-search--active' : 'ContentMenu-search'} onKeyUp={props.search}>
      <span className="ContentMenu-label">
        Search
      </span>
      <input type="text" className="ContentMenu-searchInput" onKeyUp={props.search} />
      <select className="ContentMenu-typeInput" onChange={props.setSearchType}>
        <option value="artist">Artist</option>
        <option value="track">Song</option>
      </select>
    </div>
  </div>
)
ContentMenu.propTypes = {
  search: PropTypes.func.isRequired,
  setPageSongs: PropTypes.func.isRequired,
  setSearchType: PropTypes.func.isRequired,
  contentType: PropTypes.string.isRequired,
  searchQuery: PropTypes.string
}

export default ContentMenu;