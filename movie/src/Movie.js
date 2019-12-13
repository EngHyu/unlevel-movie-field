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
    console.log('start movie constructor')
    super()
    const make_grid = (ele) => <Grid scale={ele['scale']} img={ele['img']}/>
    const make_grids = (arr) => arr.map(ele => make_grid)

    axios.get(movie)
    .then(res => res.data.data)
    .then(datas => make_grids(datas))
    .then(res => {console.log(res); return res})
    .then(grids => <Wrapper item={grids}/>)
    .then(wrapper => this.setState({...this.state, posters: wrapper }))
    .catch(err => console.log(err))
    .finally(() => console.log('finish movie constructor'))
  }

  render() {
    return <div>{this.state.posters}</div>;
  }
}

class Wrapper extends Component {
  render() {
    return (
      <div id='123'>{this.props.item}</div>
    );
  }
}

class Grid extends Component {
  make_style(img, scale) {
    return {
      backgroundImage: 'url(' + img + ')',
      width:  scale + 'px',
      height: scale + 'px',
    }
  }

  render() {
    return <div
      className='grid-item'
      style={this.make_style(this.props.img, this.props.scale)}>

    </div>
  }
}

export default Movie;
