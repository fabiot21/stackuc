import React, { Component } from 'react';
import logo from '../logo.svg';

import { base, fbase } from './FireBase';

class Home extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Stack UC</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/components/Home.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default Home;
