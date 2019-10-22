import React, { Component } from 'react';
import Booking from "./views/Booking";
import Schedule from "./views/Schedule";
import Appointment from "./views/Appointment";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "./views/Style.css";
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

class App extends Component{
  render(){
   return(
     <>
      <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Booking} />
            <Route path="/Schedule" component={Schedule} />
            <Route path="/Appointment" component={Appointment} />
          </Switch>
        </BrowserRouter>
     </>
   )
   }
}

export default App;
