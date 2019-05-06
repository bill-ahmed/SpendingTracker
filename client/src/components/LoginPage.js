import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import Button from '@material-ui/core/Button';
import './LoginPage.css';

const config = require("../../src/firebaseAPI_KEY.json");
firebase.initializeApp(config);

class LoginPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuth: false,
        }
    }

    // Configure FirebaseUI.
    uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // We will display Email and Google as auth providers.
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => false
        }
    };

    // Listen to the Firebase Auth state and set the local state.
    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
            (user) => this.setState({isAuth: !!user})
        );
    }
    
    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    handleLogOut(){
        localStorage.removeItem("userName");
        localStorage.removeItem("userPhoto");
        localStorage.removeItem("accessToken");
        firebase.auth().signOut();
        window.location.reload();
    }

    render(){
        if(!this.state.isAuth){
            return (
                <div className="loginContainer">
                    <h2>Welcome to SpendingTracker!</h2>
                    <h3>Login below to continue.</h3>
                    <StyledFirebaseAuth className="loginOptions" uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
                </div>
            )
        }
        
        // Get current user's access Token and add to local storage
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((accessToken) => {
            localStorage.setItem("accessToken", accessToken);
        }).catch(function(error) {
            console.log(error);
        });

        // Store this user's name and photo in local storage
        localStorage.setItem("userName", firebase.auth().currentUser.displayName);
        localStorage.setItem("userPhoto", firebase.auth().currentUser.photoURL);

        return(
            <div className="loginContainer">
                <h2>Welcome {firebase.auth().currentUser.displayName}!</h2>
                <br/>
                <h4>You are signed-in, click Dashboard to continue.</h4>
                <br/>
                <br/>

                <Link to="/dashboard">
                    <Button variant="contained" color="primary">Dashboard</Button>
                </Link>
                <br/>

                <Button variant="contained" color="default" onClick={() => this.handleLogOut()}>Sign-out</Button>
            </div>
        )
    }
}

export default LoginPage;