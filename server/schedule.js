const express = require("express");
const app = express();
const db = require("../database");
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  let mmmyyyy = req.query.mmmyyyy;
  db.any({
    name: "get-schedule",
    text: "SELECT schedule FROM monthlyschedule WHERE mmmyyyy = $1",
    values: [mmmyyyy]
  })
    .then(results => {
      if (results.length === 0) {
        console.log("Empty");
        db.any({
          name: "insert-new-schedule",
          text: "INSERT INTO monthlyschedule (mmmyyyy) VALUES ($1)",
          values: [mmmyyyy]
        })
          .then(results => {
            console.log("Inserted into DB");
            res.send(results);
          })
          .catch(function(error) {
            console.log("ERROR:", error);
          });
      } else {
        res.send(results);
      }
    })
    .catch(error => {
      console.log(error);
    });
});
app.post("/", (req, res) => {
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
});
app.listen(5000);
