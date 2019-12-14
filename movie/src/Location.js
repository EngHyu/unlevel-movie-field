import React, { Component } from 'react';
import axios from 'axios';
import URL from './Const.js';
import './Location.css';

class Location extends Component {
  state = {
    list: '',
    detail: '',
  }

  constructor() {
    super()
    const make_area = (ele) => {
      return [...Array(ele['count']).keys()]
        .map(e => <Area
          key={'area'+e}
          name={ele['name']}
        />)
    }

    const make_wrapper = (ele, idx) => {
      return <Wrapper
        key={'wrap'+idx}
        array={make_area(ele)}
        onClick={() => this.get_town(ele['id'])}
      />
    }
    
    axios.get(URL.CITY)
    .then(res => res.data.data)
    .then(data => data.map((ele, idx) => make_wrapper(ele, idx)))
    .then(wrapper => this.setState({...this.state, list: wrapper }))
    .catch(err => console.log(err))
    .finally(() => null)
  }

  render() {
    return <div>{this.state.list}{this.state.detail}</div>;
  }

  get_town(city_id) {
    const make_url = (data) => URL.THEATER + data['cd']
    const make_arr = (arr, ele) => arr.concat(ele.data.data)
    const make_area = (ele) => {
      return <Area
        key={ele['cd']}
        name={ele['cdNm']}
        onClick={() => this.select(ele['cd'])}
      />
    }

    axios.get(URL.TOWN + city_id)
    .then(res => res.data.data)
    .then(arr => arr.map(data => make_url(data)))
    .then(arr => arr.map(url => axios.get(url)))
    .then(arr => axios.all(arr))
    .then(res => res.reduce((arr, ele) => make_arr(arr, ele), []))
    .then(arr => arr.map(ele => make_area(ele)))
    .then(areas => <Wrapper array={areas}/>)
    .then(wrappers => this.setState({...this.state, detail: wrappers }))
    .catch(err => console.log(err))
    .finally(() => console.log('finish Location get_town', city_id))
  }

  select(id) {
    console.log(id)
  }
}

class Area extends Component {
  render() {
    return <a
      onClick={this.props.onClick}
      dataText={this.props.name}
      className='Area'
    ></a>
  }
}

class Wrapper extends Component {
  render() {
    return (<div onClick={this.props.onClick}>{this.props.array}</div>)
  }
}

export default Location;
