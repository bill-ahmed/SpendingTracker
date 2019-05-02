import React, { Component } from 'react';
import HomePage from './components/HomePage';
import './App.css';

class App extends Component {

  componentDidMount(){
    this.fetchData();
  }

  fetchData(){
    var options = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }

    const fetch = require('node-fetch');
    fetch("http://127.0.0.1:5000/test", options).then(console.log);
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
