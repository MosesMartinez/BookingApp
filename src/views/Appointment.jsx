import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import validator from "validator";
import moment from "moment";
import axios from "axios";
import "./Style.css";
import { setAppointmentForm } from "../actions/appointmentAction";

const mapStateToProps = state => {
  return {
    date: state.dateReducer.date,
    month: state.dateReducer.month,
    year: state.dateReducer.year,
    name: state.appointmentReducer.name,
    email: state.appointmentReducer.email,
    phoneNumber: state.appointmentReducer.phoneNumber,
    time: state.appointmentReducer.time
  };
};
const mapDispatchToProps = {
  setAppointmentForm
};

class Appointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTime: "",
      appointments: [],
      schedule: [],
      name: "",
      email: "",
      phoneNumber: "",
      optionTime: [],
      bookedApp: true,
      errorMessage: ""
    };
  }
  componentDidMount = () => {
    let date = this.props.month + this.props.year;
    let mmmyyyy = date.toUpperCase();
    axios
      .get("/api/appointments/", {
        params: {
          mmmyyyy: mmmyyyy
        }
      })
      .then(res => {
        let data = res.data;
        if (data.length !== 0) {
          let appointments = data[0].schedule[this.props.date - 1].appointments;
          this.setState(
            {
              appointments: appointments,
              schedule: data[0].schedule
            },
            () => this.showAppointments()
          );
        } else {
          this.props.history.push("/");
        }
      });
  };
  handleTimeChange = e => {
    this.setState({
      selectedTime: e.value
    });
  };
  inputHandler = e => {
    this.setState({
      [`${e.target.name}`]: e.target.value
    });
  };
  showAppointments = () => {
    let { appointments, optionTime } = this.state;
    for (let i = 0; i < appointments.length; i++) {
      optionTime.push({
        value: appointments[i][0],
        label: appointments[i][0],
        isDisabled: !appointments[i][1]
      });
    }
  };
  createAppointment = validation => {
    let { name, email, phoneNumber, selectedTime, errorMessage } = this.state;
    if (validation) {
      if (phoneNumber.length === 11) {
        phoneNumber = phoneNumber.slice(1);
      }
      let date =
        this.props.month.toUpperCase() + this.props.date + this.props.year;
      axios
        .post("/api/appointments/", {
          date: date,
          name: name,
          email: email,
          phonenumber: phoneNumber,
          time: selectedTime
        })
        .then(res => {
          this.updateSchedule();
        })
        .catch(function(error) {
          console.log("ERROR:", error);
        });
    } else {
      alert(errorMessage);
      this.setState({
        errorMessage: ""
      });
    }
  };
  updateSchedule = () => {
    let { schedule } = this.state;
    let mmmyyyy = this.props.month.toUpperCase() + this.props.year;
    let appointments = schedule[this.props.date - 1].appointments;
    for (let i = 0; i < appointments.length; i++) {
      if (appointments[i][0] === this.props.time) {
        appointments[i][1] = false;
        break;
      }
    }
    schedule[this.props.date - 1].appointments = appointments;
    let jsonString = JSON.stringify(schedule);
    axios
      .put("/api/appointments/", {
        mmmyyyy: mmmyyyy,
        schedule: jsonString
      })
      .then(res => {
        console.log(res.data)
        this.sendEmail();
      })
      .catch(function(error) {
        console.log("ERROR:", error);
      });
  };
  sendEmail = () => {
    let { name, email, selectedTime} = this.state;
    let dateGiven = moment(
      this.props.month + this.props.date + this.props.year + this.props.time,
      "MMMDYYYYLT"
    );
    let current = moment();
    let diff = dateGiven.diff(current, "h", true);
    let date =
      this.props.month + " " + this.props.date + ", " + this.props.year;
    axios
      .post("/api/email", {
        date: date,
        name: name,
        email: email,
        time: selectedTime
      })
      .then(res => {
        if (diff <= 24) {
          this.sendSMS();
        } else {
          this.setState({
            bookedApp: false,
          });
        }
      })
  };
  sendSMS = () => {
    let { name, time, phoneNumber} = this.state;
    let date =
      this.props.month + " " + this.props.date + ", " + this.props.year;
    axios
      .post("/api/sms", {
        date: date,
        name: name,
        phonenumber: phoneNumber,
        time: time
      })
      .then(
        this.setState({
          bookedApp: false,
        })
      );
  };
  inputValidation = () => {
    let { name, email, phoneNumber, selectedTime, errorMessage } = this.state;
    let inputValidation = true;
    if (name === "") {
      errorMessage += "Please enter your name\n";
      inputValidation = false;
    }
    if (!validator.isEmail(email)) {
      errorMessage += "Please enter a valid email address \n";
      inputValidation = false;
    }
    if (!validator.isMobilePhone(phoneNumber, "en-US")) {
      errorMessage += "Please enter a valid phone number \n";
      inputValidation = false;
    }
    if (selectedTime === "") {
      errorMessage += "Please select an available Time\n";
      inputValidation = false;
    }
    this.setState(
      {
        errorMessage: errorMessage
      },
      () => this.createAppointment(inputValidation)
    );
  };
  appointmentForm = () => {
    let { optionTime } = this.state;
    return (
      <div className="d-flex justify-content-center mt-5 mb-5">
        <div className="col-md-6 border border-info rounded border-color text-center container-width">
          <h1 className="p-4">Appointment: </h1>
          <div className="row mt-2">
            <div className="col-sm">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text"
                    id="inputGroup-sizing-default"
                  >
                    Name
                  </span>
                </div>
                <input
                  name="name"
                  onChange={e => this.inputHandler(e)}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-sm">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text"
                    id="inputGroup-sizing-default"
                  >
                    Email
                  </span>
                </div>
                <input
                  name="email"
                  type="email"
                  onChange={e => this.inputHandler(e)}
                  className="form-control"
                  placeholder="example@email.com"
                />
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-sm">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text"
                    id="inputGroup-sizing-default"
                  >
                    Phone Number
                  </span>
                </div>
                <input
                  name="phoneNumber"
                  type="text"
                  onChange={e => this.inputHandler(e)}
                  className="form-control"
                  placeholder="(555)555-5555"
                />
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-sm mb-4">
              <Select
                options={optionTime}
                onChange={e => {
                  this.handleTimeChange(e);
                }}
                isSearchable={false}
                placeholder={"Available Times .  .  . "}
              />
            </div>
          </div>
          <div className="col m-2">
            <div className="col-sm mt-5">
              <button
                onClick={this.inputValidation}
                className="btn btn-primary btn-lg p-2 mb-2 float-center"
              >
                Book Now! 
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  AppointmentBooked = () => {
    return (
      <div className="d-flex flex-column align-items-center mt-4 ">
        <div className="col border border-info rounded p-4 mb-2 border-color w-75">
          <div className="row justify-content-center">
            <p>Thank you {this.props.name} for booking an appointment</p>
          </div>
          <div className="row justify-content-center">
            <p>
              You will be recieving a confirmation email shortly at{" "}
              {this.props.email}
            </p>
          </div>
          <div className="row justify-content-center">
            <p>You can now close this window.</p>
          </div>
        </div>
      </div>
    );
  };
  render() {
    let { bookedApp } = this.state;
    let appForms = this.appointmentForm();
    let appBooked = this.AppointmentBooked();
    return (
      <div className="overflow-container">
        {bookedApp ? appForms : appBooked}
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Appointment);
// export default Appointment;
