import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';

class LoginPage extends Component{
    render(){
        return(
            <div>
                <h2>Login Page</h2>
                <br/>
                <Link to="/dashboard">
                    <h3>Dashboard</h3>
                </Link>

            </div>
        )
    }
}

export default LoginPage;