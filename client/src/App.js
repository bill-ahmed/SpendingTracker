import React, { Component } from 'react';
import HomePage from './components/HomePage';
import './App.css';

class App extends Component {

  /**Fetch data from Flask server when this component is mounted.*/
  componentDidMount(){
    this.fetchData();
  }

  /**Simple GET request  */
  fetchData(){
    var options = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }

    const fetch = require('node-fetch');
    fetch("http://127.0.0.1:5000/test", options)
    .then(res => res.json())
    .then(console.log);
  }

  render(){
    return (
      <div className="container">
        <HomePage/>
      </div>
    );
  }
  
}

export default App;
