import React, { Component } from 'react';
import CalendarWrapper from './Calendar';
import Location from './Location';
import Movie from './Movie';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    select: false,
    movie: true,
    location: true,
  }

  handler = select => {
    this.setState({ select })
  }

  stateHandler = state => {
    this.setState(state)
  }

  render() {
    const {movie, location} = this.state;
    return (
      <div className='App'>
        <h1>역전 영화 예매 사이트</h1>
        <CalendarWrapper setState={this.handler} />
        <Next setState={this.stateHandler} id='movie' />
        <Movie hide={movie} />
        <Next setState={this.stateHandler} id='location' hide={movie} />
        <Location hide={location} />
      </div>
    );
  }
}

class Next extends Component {
  render() {
    const {hide} = this.props;
    if (hide === true) return null;
    else return <button onClick={() => this.onClick()}>다음</button>
  }

  onClick() {
    const {id, setState} = this.props;    
    let state = {}
    state[id] = false
    setState(state)
  }
}

export default App;
