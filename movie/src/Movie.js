import React, { Component } from 'react';
import axios from 'axios';

const base = 'http://localhost:6006/api/'
const area = base + 'area'
const detail = base + 'detail/'
const theater = base + 'theater/'

class Movie extends Component {
  state = {
    list: ''
  }

  constructor() {
    super()
    axios.get(area)
    .then(res => res.data.map(
        ele => <Wrapper array={
          Array(ele['count'])
          .fill(<Area name={ele['name']} />)}
          id={ele['id']} />)
    )
    .then(list => this.setState({list: list}))
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
    });
  }

  render() {
    return this.state.list;
  }
}

class Area extends Component {
  render() {
    return (
      <a>{this.props.name}</a>
    );
  }
}

class Wrapper extends Component {
  render() {
    return (
      <div onClick={() => this.get_detail(this.props.id)}>{this.props.array}</div>
    );
  }

  get_detail(id) {
    axios.get(detail + id)
    .then(res => {
      console.log(res.data['basareaCdList'])
      const a = res.data['basareaCdList'].map(data => {
        axios.get(theater + data['cd'])
        .then(res => console.log(res))
      })

    })
  }
}

export default Movie;
