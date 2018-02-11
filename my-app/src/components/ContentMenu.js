import React, { Component } from 'react';
import '../css/ContentMenu.css';
//TODO Need to be able to rerender fav songs/artists if we click this after a search, or artist page
export class ContentMenu extends Component {
  render() {
    return (
      <div className="ContentMenu">
        <div className="ContentMenu-button" onClick={this.props.setPageSongs}>
          Favorite Songs
        </div>
        <div className="ContentMenu-button" onClick={this.props.setPageArtists}>
          Favorite Artists
        </div>
        <div className="ContentMenu-search">
          <label className="ContentMenu-label">
            Search
          </label>
          <input type="text" className="ContentMenu-searchInput" onKeyUp={this.props.search} />
          <select className="ContentMenu-typeInput" onChange={this.props.setSearchType}>
            <option value="artist">Artist</option>
            <option value="track">Song</option>
          </select>
        </div>
      </div>
    )
  }
}

export default ContentMenu;