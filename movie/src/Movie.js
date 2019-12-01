import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
import axios from 'axios';
import './Movie.css';

const base = 'http://localhost:6006/api/'
const movie = base + 'movie'

class Movie extends Component {
  state = {
    posters: '',
  }

  constructor() {
    super()
    axios.get(movie)
    .then(res => res.data)
    .then(movies => movies.map(ele=><Grid propo={1} img={ele['img']}/>))
    .then(res => {console.log(res); return res})
    .then(grids => this.setState({...this.state, posters: grids }))

  }

  render() {
    return <div>{this.state.posters}</div>;
  }
}

class Grid extends Component {
  render() {
    return (<div class={'grid-item grid-item-' + this.props.propo}
      style={{
        backgroundImage: 'url('+this.props.img+')',
        backgroundSize: 'cover',
      }}>
      </div>)
  }
}

export default Movie;
