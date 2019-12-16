import React, { Component } from 'react';
import axios from 'axios';
import URL from './Const.js';

import './Movie.css';
import './Animation.css';

class Movie extends Component {
  state = {
    hide: true,
    posters: '',
  }

  constructor() {
    super();
    const makeGrid = (ele, idx) => (<Grid ele={ele} key={idx} />);
    const make_grids = (data) => {
      return (<Wrapper
        num={data[0]['scale']}
        item={data.map((ele, idx) => makeGrid(ele, idx))}
      />);
    }

    axios.get(URL.MOVIE)
    .then(res => {console.log(res); return res})
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
    .finally(() => null)
  }

  render() {
    const {hide} = this.props;
    const {posters} = this.state;
    if (hide === true) return null;
    else return (<div className='ani'>
      <h2>영화를 선택해주세요!</h2>
      {posters}
    </div>);
  }
}

class Wrapper extends Component {
  make_style(row, col) {
    return {
      gridTemplateRows: 'repeat(' + row + ', 1fr)',
      gridTemplateColumns: 'repeat(' + 2 ** col + ', 1fr)',
    }
  }

  render() {
    const {num, item} = this.props;
    return <div
      className='wrapper'
      style={this.make_style(null, num, num)}
      onClick={()=>this.onClick()}
      >{item}
    </div>
  }

  onClick() {
    document.querySelectorAll('.grid-item').forEach(
      ele => {
        ele.className = 'grid-item'
      }
    )
  }

  componentDidMount() {
    const ratio = 140 // height per width
    const max_row = Math.max(...this.props.item.map(ele => ele.props.ele['row']['end']))
    document.querySelectorAll('.wrapper').forEach(
      ele => {
        ele.style.height = ratio / 2 ** this.props.num * max_row + 'vw';
        ele.style.gridTemplateRows = 'repeat(' + max_row + ', 1fr)';
      }
    )

    document.querySelectorAll('.grid-item').forEach(
      ele => {
        if (ele.offsetWidth > 480)
          ele.style.backgroundSize = 'initial'
      }
    )
  }
}

class Grid extends Component {
  state = {
    selected: false,
  }

  make_style(ele) {
    const green = ele.screen;
    return {
      gridRowStart: ele['row']['start'],
      gridRowEnd: ele['row']['end'],
      gridColumnStart: ele['col']['start'],
      gridColumnEnd: ele['col']['end'],
      backgroundBlendMode: 'overlay',
      backgroundImage: 'url(' + ele['img'] + ')',
      backgroundColor: green > 100 ? 'rgba(0, ' + green + ', 0, 0.75)' : '',
    }
  }

  render() {
    const {selected} = this.state;
    const {ele} = this.props;
    return <div
      className={ selected === true ? 'grid-item selected' : 'grid-item' }
      style={this.make_style(ele)}
      title={ele['name']}
      alt={ele['name']}
      onClick={()=>this.onClick()}
      >
    </div>
  }

  componentWillMount() {
    this.setState(this.props)
  }

  onClick() {
    const {selected} = this.state;
    this.setState({
      ...this.state,
      selected: !selected,
    })
  }
}

export default Movie;
