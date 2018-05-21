import React, { Component } from 'react';
import NewestList from './shared/NewestList';

class Tutorials extends Component {
  render() {
    return (
      <div>
        <h1>Tutoriales Recientes</h1>
        <br />
        <NewestList data="tutorials"/>
      </div>
    )
  }
}

export default Tutorials;
