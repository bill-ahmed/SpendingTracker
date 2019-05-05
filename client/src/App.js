import React, { Component } from 'react';
import { Router, Switch, Route, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import './App.css';

class App extends Component {

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
