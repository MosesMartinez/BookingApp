require("dotenv").config({ path: "../.env" });
const moment = require("moment");
const schedule = require("node-schedule");
const client = require("twilio")(
  process.env.TWILLIO_ACCOUNT_ID,
  process.env.TWILLIO_API_KEY
);
const express = require("express");
const app = express();
const db = require("../database");
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

schedule.scheduleJob("0 */30 * * * *", function() {
  let currHour = moment().format("LT");
  let nextday = moment(new Date())
    .add(1, "days")
    .format("MMMDYYYY")
    .toUpperCase();
  let nextdayFormat = moment(new Date())
    .add(1, "days")
    .format("MMM D, YYYY");
  db.any({
    name: "SMS-Appointment-Reminder",
    text: "SELECT * FROM appointments WHERE date = $1 and time = $2",
    values: [nextday, currHour]
  })
    .then(results => {
      if (results.length !== 0) {
        let name = results[0].name;
        let phonenumber = results[0].phonenumber;
        let time = results[0].time;
        client.messages
          .create({
            body: `Hello ${name} this is your 24 hour reminder for your appointment tomorrow ${nextdayFormat} at ${time}.`,
            from: process.env.TWILLIO_PHONENUMBER,
            to: `+1${phonenumber}`
          })
          .then(message => {
            console.log(message.sid);
          })
          .catch(err => {
            console.log(err);
          })
          .done();
      } else {
        console.log(`No Appointment Reminders on ${nextday} at ${currHour}`);
      }
    })
    .catch(err => {
      console.log(err);
    });
});
app.post("/", (req, res) => {
  let date = req.body.date;
  let name = req.body.name;
  let phonenumber = req.body.phonenumber;
  let time = req.body.time;
  client.messages
    .create({
      body: `Hello ${name} this is your 24 hour reminder for your appointment tomorrow ${date} at ${time}.`,
      from: process.env.TWILLIO_PHONENUMBER,
      to: `+1${phonenumber}`
    })
    .then(message => {
      console.log(message.sid);
    })
    .catch(err => {
      console.log("Error in sms api" + err);
    })
    .done();
});
app.listen(5002);
