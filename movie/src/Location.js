import React, { Component } from 'react';
import axios from 'axios';

const base = 'http://localhost:6006/api/'
const area = base + 'area'
const detail = base + 'detail/'
const theater = base + 'theater/'

class Location extends Component {
  state = {
    list: '',
    detail: ''
  }

  constructor() {
    super()
    axios.get(area)
    .then(res => res.data.map(
        ele => 
        <Wrapper
          array={Array(ele['count']).fill(<Area name={ele['name']} />)}
          onClick={() => this.get_detail(ele['id'])}
        />
      )
    )
    .then(list => this.setState({...this.state, list: list }))
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
    });
  }

  render() {
    return <div>{this.state.list}{this.state.detail}</div>;
  }

  get_detail(id) {
    axios.get(detail + id)
    .then(res => res.data['basareaCdList'].map(
      data => axios.get(theater + data['cd'])
    ))
    .then(arr => axios.all(arr))
    .then(res => res.reduce(
      (arr, ele) => arr.concat(ele.data['theaCdList']), [])
    )
    .then(arr =>
      <Wrapper
        array={arr.map(
          ele=><Area
            name={ele['cdNm']}
            onClick={() => this.select(ele['cd'])}
          />
        )}
      />
    )
    .then(list => this.setState({...this.state, 'detail': list }))
  }

  select(id) {
    console.log(id)
  }
}

class Area extends Component {
  render() {
    return (
      <a onClick={this.props.onClick}>{this.props.name}</a>
    );
  }
}

class Wrapper extends Component {
  render() {
    return (
      <div onClick={this.props.onClick}>{this.props.array}</div>
    );
  }
}

export default Location;
