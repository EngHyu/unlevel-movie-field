import React, { Component } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';

class CalendarWrapper extends Component {
  today = new Date()
  next_week = new Date()

  state = {
    date: new Date(),
  }

  onChange = date => {
    this.props.setState(true)
    this.setState({ date })
  }

  render() {
    return (
      <div>
        <h2>영화 관람일을 선택해주세요!</h2>
        <Calendar
          onChange={this.onChange}
          value={this.state.date}
        />
      </div>
    );
  }
}

export default CalendarWrapper;
