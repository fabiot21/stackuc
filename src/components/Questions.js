import React, { Component } from 'react';
import NewestList from './shared/NewestList';

class Questions extends Component {
  render() {
    return (
      <div>
        <h1>Preguntas Recientes</h1>
        <br />
        <NewestList data="questions"/>
      </div>
    )
  }
}

export default Questions;
