
import React from 'react';


import DatePicker from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';


class DatePic extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            startDate: new Date(),
            firstTime: true         
        };
        
        this.handleChange = this.handleChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

  
    handleChange(date) {
        this.setState({
            startDate: date,
            firstTime: false
        })
    }

    onFormSubmit(e) {
        e.preventDefault();
        console.log(this.state.startDate)
    }

    render() {
        
        return ( 
            <DatePicker
            selected={this.state.firstTime ? this.props.initDate : this.state.startDate}
            onChange={this.handleChange}
            dateFormat="yyyy-MM-dd"
            className="form-control d-inline p-2"
            onSubmit={this.onFormSubmit}
            disabled={!this.props.disabled}
        />

        )
    }
}

export default DatePic
