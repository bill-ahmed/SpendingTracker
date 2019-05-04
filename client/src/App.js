import React, { Component } from 'react';
import { Router, Switch, Route, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import './App.css';

class App extends Component {

  /**Fetch data from Flask server when this component is mounted.*/
  componentDidMount(){
    this.fetchData();
  }

  /**Simple GET request to test server.js api */
  fetchData(){
    var options = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }

    const fetch = require('node-fetch');
    fetch("https://127.0.0.1:5000/test", options)
    .then(res => {
      console.log(res);
      return res.json()})
    .then(console.log);
  }

  render(){
    return (
      <div className="container">
        {/* Handle routing for all the components */}
        <Switch>
          <Route exact path="/" component={LoginPage}/>
          <Route exact path="/dashboard" component={Dashboard}/>
        </Switch>
        <Footer/>
      </div>
    );
  }
  
}

export default App;
