require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express();
const sgMail = require("@sendgrid/mail");
let bodyParser = require("body-parser");
const client = require("twilio")(
  process.env.TWILLIO_ACCOUNT_ID,
  process.env.TWILLIO_API_KEY
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
app.post("/", (req, res) => {
  let date = req.body.date;
  let name = req.body.name;
  let email = req.body.email;
  let time = req.body.time;
  const msg = {
    to: email,
    from: process.env.SEND_GRID_EMAIL,
    subject: "Appointment Booked",
    text: `${name} your appointment on ${date} at ${time} has been booked`
  };
  sgMail.send(msg, (error, results) => {
    if (error) {
      console.log("Error in email attempt" + error);
      res.send("Failure");
    } else {
  client.messages
    .create({
      body: `${name} has booked an appointment for ${date} at ${time}.`,
      from: process.env.TWILLIO_PHONENUMBER,
      to: process.env.PERSONAL_PHONENUBER
    })
    .then(message => {
      console.log(message.sid);
    })
    .catch(err => {
      console.log(err);
    })
    .done();
    res.send("Email Sent");
  }
  });
});
app.listen(5003);
