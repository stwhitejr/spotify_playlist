import React, { Component } from 'react';

export class FavArtists extends Component {
  render() {
    return (
      <div className="FavArtists">
        <div>
          <h1>Artists</h1>
          {this.props.favArtists ?
            this.props.favArtists.map(artist => <div key={artist.id}>{artist.name}</div>) : ''
          }
        </div>
      </div>
    )
  }
}

export default FavArtists;