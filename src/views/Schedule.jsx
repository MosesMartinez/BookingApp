/* eslint-disable no-script-url */
import React, { Component } from "react";
import moment from "moment";
import axios from "axios";
import Switch from "react-switch";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { CSSTransition } from "react-transition-group";
import "./Style.css";
const Hours = [
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
  "10:30 PM",
  "11:00 PM",
  "11:30 PM"
];
class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      date: moment(),
      setMonth: moment().format("MMM"),
      currMonth: moment().format("MMM"),
      currDate: moment().format("D"),
      currYear: moment().format("Y"),
      daysInMonth: moment().daysInMonth(),
      dateChange: false,
      yearChange: false,
      monthCounter: 1,
      schedule: null,
      selectedDate: null
    };
  }
  componentDidMount = () => {
    this.getAppointments();
  };
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
    daysInMonth = moment(`${currYear}-${currMonth}`, "YYYY-MMM").daysInMonth();
    dateChange = true;
    if (currMonth === "Jan") {
      currYear = moment(newdate).format("Y");
      yearChange = true;
    }
    this.setState(
      {
        currMonth: currMonth,
        date: newdate,
        currYear: currYear,
        monthCounter: monthCounter + 1,
        dateChange: dateChange,
        yearChange: yearChange,
        daysInMonth: daysInMonth,
        schedule: null
      },
      () => this.getAppointments()
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
      daysInMonth = moment(
        `${currYear}-${currMonth}`,
        "YYYY-MMM"
      ).daysInMonth();
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
          monthCounter: monthCounter - 1,
          dateChange: dateChange,
          yearChange: yearChange,
          daysInMonth: daysInMonth,
          schedule: null
        },
        () => this.getAppointments()
      );
    }
  };
  getAppointments = () => {
    let { currMonth, currYear } = this.state;
    let mmmyyyy = currMonth + currYear;
    axios
      .get("/api/schedule/", {
        params: {
          mmmyyyy: mmmyyyy.toUpperCase(),
          access_token: localStorage.getItem("token")
        }
      })
      .then(res => {
        let data = res.data;
        if (data.length === 0) {
          this.createNewSchedule();
        } else {
          let schedule = data[0].schedule;
          if (schedule == null) {
            this.createNewSchedule();
          } else {
            this.setState({
              schedule: schedule
            });
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  addAppointment = (event, date) => {
    let { schedule } = this.state;
    let appointments = schedule[date - 1].appointments;
    let contain = false;
    for (let i = 0; i < appointments.length; i++) {
      if (appointments[i][0] === event.target.value) {
        contain = true;
        break;
      }
    }
    if (contain !== true) {
      appointments.push([event.target.value, true]);
    }
    appointments.sort(function(a, b) {
      return (
        Date.parse("01/01/2000 " + a[0]) - Date.parse("01/01/2000 " + b[0])
      );
    });
    schedule[date - 1].appointments = appointments;
    this.setState({
      schedule: schedule
    });
  };
  selectHour = date => {
    let selectHour = Hours;
    let optionSelect = function(X) {
      return (
        <option value={X} key={X}>
          {X}
        </option>
      );
    };
    return (
      <div className="mt-3 mb-3 d-flex flex-column align-items-center">
      <h5>Add new available time:</h5>
      <select onChange={e => this.addAppointment(e, date)}>
        {selectHour.map(optionSelect)}
      </select>
      </div>
    );
  };
  createNewSchedule = () => {
    let { currMonth, currYear, daysInMonth } = this.state;
    let schedule = [];
    for (let i = 0; i < daysInMonth; i++) {
      var obj = {
        date: `${currMonth} ${i + 1}, ${currYear}`,
        appointments: []
      };
      schedule.push(obj);
    }
    this.setState({
      schedule: schedule
    });
  };
  showAppointments = () => {
    let { currMonth, schedule, selectedDate } = this.state;
    if (schedule !== null && selectedDate !== null) {
      let Appointments = [];
      let times = schedule[selectedDate - 1].appointments;
      for (let i = 0; i < times.length; i++) {
        Appointments.push(
          <div
            key={`Appointments #${i + 1} ${currMonth} ${selectedDate}`}
            className="schedule-calendar  mt-2 w-75"
          >
            <div className="col">
              <span className="">{times[i]}</span>
            </div>
            <div className="col">
              <Switch
                onChange={() => this.handleChange(selectedDate, i)}
                checked={times[i][1]}
                className="react-switch"
                height={20}
                width={36}
              />
            </div>
            <div className="col">
              <button
                onClick={() => this.removeAppointment(selectedDate, i)}
                className="btn btn-danger btn-sm float-right"
                style={{ width: "26px" }}
                disabled={!times[i][1]}
              >
                x
              </button>
            </div>
          </div>
        );
      }
      return (
        <div className="d-flex flex-column align-items-center w-100">
          <div className="row">
            {this.selectHour(selectedDate)}
          </div>
          <div className="d-flex flex-column align-items-center w-100">{Appointments}</div>{" "}
        </div>
      );
    }
  };
  ShowModal = date => {
    let { show } = this.state;
    this.setState({
      show: !show,
      selectedDate: date
    });
  };
  setCellBackground = date => {
    let { currMonth, schedule, currYear } = this.state;
    if (schedule !== null) {
      let times = schedule[date - 1].appointments;
      if (times.length === 0) {
        return (
          <td
            key={`${currYear}-${currMonth} ` + date}
            className="p-sm-2 schedule-empty"
            style={{ position: "relative" }}
          >
            <div onClick={() => this.ShowModal(date)}>{date}</div>
          </td>
        );
      } else {
        return (
          <td
            key={`${currYear}-${currMonth} ` + date}
            className="p-sm-2 schedule-cell"
            style={{ position: "relative" }}
          >
            <div onClick={() => this.ShowModal(date)}>{date}</div>
          </td>
        );
      }
    }
  };
  saveSchedule = () => {
    let { currMonth, currYear, schedule } = this.state;
    let mmmyyyy = currMonth + currYear;
    let jsonString = JSON.stringify(schedule);
    axios
      .post(
        "/api/schedule/",
        {
          mmmyyyy: mmmyyyy.toUpperCase(),
          schedule: jsonString
        },
        {
          params: {
            access_token: localStorage.getItem("token")
          }
        }
      )
      .then(res => {
        console.log("Schedule Saved")
      })
      .catch(err => {
        alert(err);
      });
  };
  renderMonth = () => {
    let { date, daysInMonth } = this.state;
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
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(this.setCellBackground(d));
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
  handleChange = (date, i) => {
    let { schedule } = this.state;
    schedule[date - 1].appointments[i][1] = !schedule[date - 1].appointments[
      i
    ][1];
    this.setState({
      schedule: schedule
    });
  };
  removeAppointment = (date, index) => {
    let { schedule } = this.state;
    let appointments = schedule[date - 1].appointments;
    appointments.splice(index, 1);
    schedule[date - 1].appointments = appointments;
    this.setState({
      schedule: schedule
    });
  };
  closeModal = () => {
    let { show } = this.state;
    this.setState({
      show: !show
    }, () => this.saveSchedule());
  };
  render() {
    let { currMonth, currYear } = this.state;
    let { show } = this.state;
    let table = this.renderMonth();
    let appointments = this.showAppointments();
    return (
      <div className="d-flex flex-column align-items-center mt-5 calendar-width">
        <Modal show={show} onHide={() => this.closeModal()}>
          <Modal.Body className="justify-content-center">
            {appointments}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => this.closeModal()}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
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
        <div className="row p-1">
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
export default Schedule;
