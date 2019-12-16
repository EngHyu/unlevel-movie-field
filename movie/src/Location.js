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
    let data = await this.getCityAPI();
    data = this.processData(data);

    this.setState({
      ...this.state,
      location: data,
    });
  }

  async getCityAPI() {
    const theater = await (await axios.get(URL.THEATER)).data.theater;
    // console.log(theater)
    // let state = {}
    // city.map((ele, idx) => {
    //   const {id, name} = ele;

    //   state[name] = Object.values(town)[idx].reduce((a, e) => {
    //     const t_id = e.cd
    //     const name = theater[id].map(e => e.cdNm)
    //     return a.concat(name)
    //   }, [])
    // })

    // return state

    // let state = {}
    // for (let [id, arr] of Object.entries(theater)) {
    //   for (let ele of arr) {
    //     state
    //   }
    // }
    return theater
  }

  processData(data) {
    console.log(data)
    let wrapper = [];
    for (let [key, values] of Object.entries(data)) {
      wrapper.push(values.map(ele => this.makeArea(ele['name'], ele['cdNm'])))
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
