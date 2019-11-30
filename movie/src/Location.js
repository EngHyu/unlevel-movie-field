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
    const make_area = (ele) => Array(ele['count']).fill(<Area name={ele['name']}/>)
    const make_wrapper = (ele) => <Wrapper array={make_area(ele)} onClick={() => this.get_detail(ele['id'])}/>
    
    axios.get(area)
    .then(res => res.data)
    .then(data => data.map(ele => make_wrapper(ele)))
    .then(wrapper => this.setState({...this.state, list: wrapper }))
    .catch(err => console.log(err))
    .finally(() => console.log('finish Location constructor', area))
  }

  render() {
    return <div>{this.state.list}{this.state.detail}</div>;
  }

  get_detail(id) {
    console.log('start Location get_detail', id)
    const make_url = (data) => theater + data['cd']
    const make_arr = (arr, ele) => arr.concat(ele.data['theaCdList'])
    const make_area = (ele) => <Area name={ele['cdNm']} onClick={() => this.select(ele['cd'])}/>

    axios.get(detail + id)
    .then(res => res.data['basareaCdList'])
    .then(arr => arr.map(data => make_url(data)))
    .then(arr => arr.map(url => axios.get(url)))
    .then(arr => axios.all(arr))
    .then(res => res.reduce((arr, ele) => make_arr(arr, ele), []))
    .then(arr => arr.map(ele => make_area(ele)))
    .then(areas => <Wrapper array={areas}/>)
    .then(wrappers => this.setState({...this.state, detail: wrappers }))
    .catch(err => console.log(err))
    .finally(() => console.log('finish Location get_detail', id))
  }

  select(id) {
    console.log(id)
  }
}

class Area extends Component {
  render() {
    return (<a onClick={this.props.onClick}>{this.props.name}</a>)
  }
}

class Wrapper extends Component {
  render() {
    return (<div onClick={this.props.onClick}>{this.props.array}</div>)
  }
}

export default Location;
