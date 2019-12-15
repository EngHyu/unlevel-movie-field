import React, { Component } from 'react';
import axios from 'axios';
import URL from './Const.js';
import './Location.css';

class Location extends Component {
  state = {
    location: undefined,
  }

  constructor() {
    super();
    this.getCity();
  }

  async getCity() {
    let data = await this.getCityAPI();
    data = this.processData(data);

    this.setState({
      ...this.state,
      location: data,
    });
  }

  async getCityAPI() {
    const res = await axios.get(URL.CITY);
    const arr = res.data.data;
    return arr;
  }

  processData(data) {
    const wrapper = data.map((ele) => {
      return this.makeWrapper(ele);
    })
    return wrapper;
  }

  makeWrapper({id, name, count}) {
    return (<Wrapper
      id={id}
      key={id}
      city={this.makeArea(name, count)}
    />);
  }

  makeArea(name, count) {
    return [...Array(count).keys()]
    .map(e => {
      return (<Area name={name} key={'city' + e} />);
    });
  }

  render() {
    const {location} = this.state;
    return (<div>{location}</div>);
  }
}

class Area extends Component {
  state = {
    type: 'city',
    id: undefined,
    name: undefined,
  }

  componentWillMount() {
    this.setState(this.props);
  }

  render() {
    const {name} = this.state;
    return <a
      datatext={name}
      className='Area'
      onClick={() => {this.onClick()}}
    ></a>;
  }

  onClick() {
    const {type, id} = this.state;
    if (type !== 'theater') return;
    this.getSchedule(id);
  }

  getSchedule(id) {
    console.log(this.state, id);
  }
}

class Wrapper extends Component {
  state = {
    id: undefined,
    type: 'city',
    city: undefined,
    theater: undefined,
  }

  componentWillMount() {
    this.setState(this.props);
  }

  render() {
    const {city, theater} = this.state;
    return (<div
      onClick={() => this.onClick()}
    >
      {city}
      {theater}
    </div>);
  }

  onClick() {
    const {type, id} = this.state;
    if (type !== 'city') return;
    this.getTown(id);
  }

  async getTown(city_id) {
    let data = await this.getTownAPI(city_id);
    data = this.processData(data);

    this.setState({
      ...this.state,
      type: 'theater',
      theater: data,
    });
  }

  async getTownAPI(city_id) {
    const res = await axios.get(URL.TOWN + city_id);
    const arr = res.data.data;
    const arr_1 = arr.map(({ cd }) => URL.THEATER + cd);
    const arr_2 = arr_1.map(url => axios.get(url));
    return await axios.all(arr_2);
  }

  processData(data) {
    const arr = data.reduce((arr, {data}) => arr.concat(data.data), []);
    const areas = arr.map(ele => this.makeArea(ele));
    const wrapper = <Wrapper city={areas}/>;
    return wrapper;
  }

  makeArea({cd, cdNm}) {
    return (<Area
      id={cd}
      name={cdNm}
      type='theater'
      key={'theater'+cd}
    />);
  }
}

export default Location;
