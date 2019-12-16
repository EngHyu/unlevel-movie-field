import React, { Component } from 'react';
import axios from 'axios';
import URL from './Const.js';
import './Location.css';

class Location extends Component {
  state = {
    hide: true,
    location: undefined,
  }

  constructor() {
    super();
    this.getCity();
  }

  async getCity() {
    const {city, theater} = await this.getCityAPI();
    const data = this.processData(city, theater);

    this.setState({
      ...this.state,
      location: data,
    });
  }

  async getCityAPI() {
    const theater = await (await axios.get(URL.THEATER)).data.theater;
    const city = await (await axios.get(URL.CITY)).data.city;
    return {'theater': theater, 'city': city}
  }

  processData(city, theater) {
    // console.log(data)
    // let wrapper = [];
    // for (let [key, values] of Object.entries(data)) {
    //   wrapper.push(values.map(ele => this.makeArea(ele['name'], ele['cdNm'])))
    // }
    let wrapper = [];
    for (let c of city.data) {
      wrapper.push(theater[c.id].map(ele => this.makeArea(ele['name'], ele['cdNm'])))
      // console.log(key, values, theater)
    //   wrapper.push(values.map(ele => this.makeArea(ele['name'], ele['cdNm'])))

    }
    return wrapper;
  }

  makeArea(city, theater) {
    return (<Area
      city={city}
      theater={theater}
      type='theater'
      key={theater}
    />);
  }

  render() {
    const {hide} = this.props;
    const {location} = this.state;
    if (hide === true) return ('');
    else return (<div onClick={()=>this.onClick()}>
      <h2>영화관을 선택해주세요!</h2>
      {location}
    </div>);
  }

  onClick() {
    document.querySelectorAll('.Area-Container.selected').forEach(
      ele => {
        ele.className = 'Area-Container'
      }
    )
  }
}

class Area extends Component {
  state = {
    hide: true,
    city: undefined,
    theater: undefined,
  }

  componentWillMount() {
    this.setState(this.props);
  }

  render() {
    const {hide, city, theater} = this.state;
    
    return <div
    className={ hide === false ? 'Area-Container selected' : 'Area-Container' }
    onClick={() => {this.onClick()}}
    
    ><a
      databefore={city}
      dataafter={'\n\n'+theater}
      className='Area'
    ></a></div>;
  }

  onClick() {
    const {hide} = this.state
    this.setState({
      ...this.state,
      hide: !hide,
    })
  }
}

export default Location;
