import React, { Component } from 'react';
import Calendar from 'react-calendar';

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
        <Calendar
          onChange={this.onChange}
          value={this.state.date}
        />
      </div>
    );
  }
}

export default CalendarWrapper;
