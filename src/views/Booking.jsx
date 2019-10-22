/* eslint-disable eqeqeq */
/* eslint-disable no-script-url */
import React, { Component } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./Style.css";
import axios from "axios";
import { setDate } from "../actions/dateAction";
import { CSSTransition } from "react-transition-group";
const mapStateToProps = state => {
  return {
    date: state.dateReducer.date,
    year: state.dateReducer.year,
    month: state.dateReducer.month
  };
};
const mapDispatchToProps = {
  setDate
};
class Booking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment(),
      setMonth: moment().format("MMM"),
      currMonth: moment().format("MMM"),
      currDate: moment().format("D"),
      currYear: moment().format("Y"),
      daysInMonth: moment().daysInMonth(),
      dateChange: false,
      yearChange: false,
      monthCounter: 1,
      emptyMonth: false,
      schedule: []
    };
  }
  componentDidMount = () => {
    this.getSchedule();
  };
  getSchedule() {
    let { currMonth, currYear } = this.state;
    let mmmyyyy = currMonth + currYear;
    axios
      .get("/api/appointments/", {
        params: {
          mmmyyyy: mmmyyyy.toUpperCase()
        }
      })
      .then(res => {
        let data = res.data;
        if (data.length !== 0) {
          let schedule = data[0].schedule;
          if (schedule !== null) {
            this.setState(
              {
                schedule: schedule
              },
              () => this.renderMonth()
            );
          }
        }
      });
  }
  nextMonth = () => {
    let {
      currMonth,
      dateChange,
      yearChange,
      currYear,
      monthCounter,
      daysInMonth,
      date
    } = this.state;
    let newdate = moment(date).add(1, "M");
    currMonth = moment(newdate).format("MMM");
    dateChange = true;
    daysInMonth = moment().daysInMonth(newdate);
    if (currMonth === "Jan") {
      currYear = moment(newdate).format("Y");
      yearChange = true;
    }
    this.setState(
      {
        currMonth: currMonth,
        date: newdate,
        daysInMonth: daysInMonth,
        currYear: currYear,
        monthCounter: monthCounter + 1,
        dateChange: dateChange,
        yearChange: yearChange,
        schedule: []
      },
      () => this.getSchedule()
    );
  };
  prevMonth = () => {
    let {
      currMonth,
      setMonth,
      yearChange,
      dateChange,
      currYear,
      monthCounter,
      daysInMonth,
      date
    } = this.state;
    if (monthCounter > 1) {
      let newdate = moment(date).subtract(1, "M");
      currMonth = moment(newdate).format("MMM");
      daysInMonth = moment().daysInMonth(newdate);
      if (currMonth === "Dec") {
        currYear = moment(newdate).format("Y");
        yearChange = false;
      }
      if (currMonth === setMonth && !yearChange) {
        dateChange = false;
      }
      this.setState(
        {
          currMonth: currMonth,
          date: newdate,
          currYear: currYear,
          daysInMonth: daysInMonth,
          monthCounter: monthCounter - 1,
          dateChange: dateChange,
          yearChange: yearChange,
          schedule: []
        },
        () => this.getSchedule()
      );
    }
  };
  availableDay = date => {
    let { schedule, currMonth, currYear, currDate, monthCounter } = this.state;
    let todayStyle = "p-sm-2 calendar-cell justify-content-center border border-success calendar-day";
    let bookedStyle = "p-sm-2  calendar-cell-empty justify-content-center";
    let availableStyle = "p-sm-2 calendar-cell justify-content-center";
    let todayBooked = "p-sm-2 calendar-cell justify-content-center border border-success calendar-day calendar-cell-empty";
    let appointments = [];
    let booked = false;
    if (schedule.length == 0) {
      booked = true;
    } else {
      let counter = 0;
      appointments = schedule[date - 1].appointments;
      for (let i = 0; i < appointments.length; i++) {
        if (appointments[i][1] === false) {
          counter += 1;
        }
      }
      if (counter === appointments.length) {
        booked = true;
      }
    }
    if (booked === false) {
      return (
        <td
          key={`${currYear}-${currMonth} ` + date}
          className={
            date == currDate && monthCounter == 1 ? todayStyle : availableStyle
          }
        >
          <Link
            to="Appointment"
            onClick={() => this.props.setDate(date, currMonth, currYear)}
            style={{ textDecoration: "none" }}
          >
            {date}
          </Link>
        </td>
      );
    } else {
      return (
        <td
          key={`${currYear}-${currMonth} ` + date}
          className={
            date == currDate && monthCounter == 1 ? todayBooked : bookedStyle
          }
        >
          <button
            type="button"
            style={{ textDecoration: "none" }}
            className="btn btn-link"
            disabled
          >
            {date}
          </button>
        </td>
      );
    }
  };
  renderMonth = () => {
    let {
      currDate,
      currMonth,
      currYear,
      date,
      dateChange,
      // monthCounter
    } = this.state;
    let startOfMonth = moment(date)
      .startOf("month")
      .format("d");
    let blanks = [];
    for (let i = 0; i < startOfMonth; i++) {
      blanks.push(
        <td
          key={"empty cell " + i}
          className="p-sm-2 calendar-cell-empty justify-content-center"
        >
          {" "}
        </td>
      );
    }
    let days = [];
    for (
      let d = 1;
      d <= moment(`${currYear}-${currMonth}`, "YYYY-MMM").daysInMonth();
      d++
    ) {
      let available = dateChange ? 1 : currDate;
      if (d < available) {
        days.push(
          <td
            key={`${currYear}-${currMonth} ` + d}
            className="p-sm-2 calendar-cell-empty justify-content-center"
          >
            <button
              type="button"
              style={{ textDecoration: "none" }}
              className="btn btn-link "
              disabled
            >
              {d}
            </button>
          </td>
        );
      }
      // eslint-disable-next-line eqeqeq
       else {
        days.push(this.availableDay(d));
      }
    }
    let totalSlots = [...blanks, ...days];
    let rows = [];
    let cells = [];
    let week = moment.weekdaysShort().map(day => {
      return (
        <th key={day} className="p-sm-2 thickness-border text-center">
          <h3 className="calendar-font">{day}</h3>
        </th>
      );
    });
    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        rows.push(cells);
      }
    });
    let daysTable = rows.map((d, k) => {
      return <tr key={k}>{d}</tr>;
    });
    return (
      <table className="table-responsive">
        <thead>
          <tr>{week}</tr>
        </thead>
        <tbody>{daysTable}</tbody>
      </table>
    );
  };
  render() {
    let { currMonth, currYear } = this.state;
    let table = this.renderMonth();
    return (
      <div className="d-flex flex-column align-items-center mt-5 calendar-width">
        <div className="d-flex flex-row">
          <div className="d-flex flex-column">
            <div className="d-flex flex-row">
              <button
                className="col-xs left-button butn mb-2"
                onClick={() => this.prevMonth()}
              ></button>
              <h1
              className="calendar-font calendar-month"
                style={{
                  float: "center",
                  fontFamily: "Lucida Console, monospace",
                  textTransform: "uppercase"
                }}
              >
                {currMonth}
              </h1>
              <button
                className="col-xs right-button butn mb-2"
                onClick={() => this.nextMonth()}
              ></button>
            </div>
          </div>
          <div className="col ">
            <h1
            className="calendar-font calendar-year"
              style={{
                fontFamily: "Lucida Console, monospace",
                textTransform: "uppercase"
              }}
            >
              {currYear}
            </h1>
          </div>
        </div>
        <div className="row">
          <CSSTransition
            key={currMonth}
            in={true}
            appear={true}
            timeout={1000}
            classNames="fade"
          >
            {table}
          </CSSTransition>
        </div>
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Booking);
