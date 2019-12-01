import React, { Component } from 'react';
import CalendarWrapper from './Calendar';
import Location from './Location';
import Movie from './Movie';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    select: false
  }

  handler = select => {
    this.setState({ select })
  }

  render() {
    return (
      <div>
        <Movie />
        {/* <CalendarWrapper setState={this.handler} />
        <Location /> */}
      </div>
    );
  }
}

export default App;
