import React, { Component } from 'react';
import axios from 'axios';
import './Movie.css';
import URL from './Const.js';

class Movie extends Component {
  state = {
    posters: '',
  }

  constructor() {
    super()

    const make_grid = (ele, idx) => <Grid ele={ele} key={idx} />
    const make_grids = (data) => <Wrapper num={data[0]['scale']} item={data.map((ele, idx) => make_grid(ele, idx))}/>

    axios.get(URL.MOVIE)
    .then(res => res.data.data)
    .then(data => {
      let max = { 'h': 0, 'w': 2 ** data[0]['scale'] }
      let left = { 'x': 1, 'y': 1 }

      let pre_scale = 0
      for (let i of data) {
        if (max['h'] === 0) {
          max['h'] = 2 ** i['scale']
          left['area'] = max['w'] * max['h']
        }

        if (pre_scale !== 0 && i['scale'] !== pre_scale) {
          left['py'] = left['y'] + 2 ** i['scale']
          left['px'] = left['x']
        }

        i['row'] = { 'start': 1, 'end': 1 }
        i['col'] = { 'start': 1, 'end': 1 }

        i['row']['start'] = left['y']
        i['row']['end'] = i['row']['start'] + 2 ** i['scale']

        i['col']['start'] = left['x']
        i['col']['end'] = i['col']['start'] + 2 ** i['scale']

        left['area'] -= (2 ** i['scale']) ** 2
        left['x'] = i['col']['end']

        if (left['x'] > max['w']) {
          left['x'] = left['px']
          left['y'] = left['py']
        }

        if (left['area'] === 0) {
          left['x'] = 1
          left['y'] = i['row']['end']
          max['h'] = 0
        }

        pre_scale = i['scale']
      }
      return data
    })
    .then(data => make_grids(data))
    .then(wrapper => this.setState({...this, posters: wrapper}))
    .catch(err => console.log(err))
    .finally(() => console.log('finish movie constructor'))
  }

  render() {
    return <div>{this.state.posters}</div>;
  }

  componentDidUpdate() {
    document.querySelectorAll('.grid-item').forEach(
      ele => {
        if (ele.offsetWidth < 600)
          ele.style.backgroundSize = 'cover'
      }
    )
  }
}

class Wrapper extends Component {
  make_style(num) {
    return {
      gridTemplateRows: 'repeat(' + 2 * 2 ** num + ', 1fr)',
      gridTemplateColumns: 'repeat(' + 2 ** num + ', 1fr)',
    }
  }

  render() {
    return <div
      id='wrapper'
      style={this.make_style(this.props.num)}>{this.props.item}
    </div>
  }
}

class Grid extends Component {
  make_style(ele) {
    return {
      gridRow: ele['row']['start'] + '/' + ele['row']['end'],
      gridColumn: ele['col']['start'] + '/' + ele['col']['end'],
      backgroundImage: 'url(' + ele['img'] + ')',
    }
  }

  render() {
    return <div
      className='grid-item'
      style={this.make_style(this.props.ele)}>
    </div>
  }
}

export default Movie;
