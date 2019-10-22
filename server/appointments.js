const express = require("express");
const app = express();
const db = require("../database");
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  let mmmyyyy = req.query.mmmyyyy;
  db.any({
    name: "get-appointments",
    text: "SELECT schedule FROM monthlyschedule WHERE mmmyyyy = $1",
    values: [mmmyyyy]
  })
    .then(results => {
      res.send(results);
    })
    .catch(error => {
      console.log(error);
    });
});
app.post("/", (req, res) => {
  let date = req.body.date;
  let name = req.body.name;
  let email = req.body.email;
  let phonenumber = req.body.phonenumber;
  let time = req.body.time;
  db.any({
    name: "insert-appointment",
    text:
      "INSERT INTO appointments(date, name, email, phonenumber, time) VALUES($1,$2,$3,$4,$5)",
    values: [date, name, email, phonenumber, time]
  })
    .then(results => {
      res.send("Appointment Booked " + results);
    })
    .catch( error => {
      console.log("ERROR:", error);
      res.status(500).send(error);
    });
});
app.put('/', (req, res) =>{
  let mmmyyyy = req.body.mmmyyyy;
  let schedule = req.body.schedule;
  db.any({
    name: "update-schedule",
    text: "UPDATE monthlyschedule SET schedule = $1 WHERE mmmyyyy= $2",
    values: [schedule, mmmyyyy]
  })
    .then(results => {
      res.send("Schedule Saved");
    })
    .catch(function(error) {
      console.log("ERROR:", error);
      res.status(500).send(error);
    });
})
app.listen(5001);
