import React, { Component } from 'react';
import Trends from './dashboard/Trends';
import RecentActivity from './dashboard/RecentActivity';
import DetailedActivity from './dashboard/DetailedActivity';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import firebase from 'firebase';
import './Dashboard.css';

const fetch = require('node-fetch');

class HomePage extends Component{

    constructor(props){
        super(props);

        // Bind all functions to "this"
        this.fetchData = this.fetchData.bind(this);
        this.updateData = this.updateData.bind(this);
        this.handleUserMenuOpen = this.handleUserMenuOpen.bind(this);
        this.handleUserMenuClose = this.handleUserMenuClose.bind(this);

        // If userName is not set, sign-out this user
        if(localStorage.getItem("userName") === null){
            this.handleLogOut();
        }

        // Retrieve name of user currently signed-in
        // try{
        //     var userName = firebase.auth().currentUser.displayName.split(" ")
        // } catch{
        //     this.handleLogOut();
        // }

        this.state = {
            userMenuOpen: {anchorEl: null},
            currUserMenuItem: null,
            userName: localStorage.getItem("userName").split(" "),
        }
    }

    /**POST request to server.js API, response is transaction data */
    fetchData(){
        var endpoint = "https://127.0.0.1:5000/_api/fetchData";
        var body = {
            "accessToken": localStorage.getItem("accessToken"),
        }

        var options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        }

        fetch(endpoint, options)
        .then(res => {
            console.log(res);
            return res.json()})
        .then(console.log)
        .catch((error) => console.log({"Error": error}));
    }

    updateData(){
        //TO-DO
    }

    handleUserMenuOpen(event){
        this.setState({userMenuOpen: {anchorEl: event.currentTarget}});
    }

    handleUserMenuClose(event, itemSelected){
        this.setState({currUserMenuItem: itemSelected});
        this.setState({userMenuOpen: {anchorEl: null}});

        //If user clicked logout
        if(itemSelected === 'Logout'){
            this.handleLogOut();
        }
    }

    handleLogOut(){
        localStorage.removeItem("userName");
        localStorage.removeItem("accessToken");
        firebase.auth().signOut();
        window.location.href = "/";
    }

    render(){
        // Determine if the user menu is open or not
        const {anchorEl} = this.state.userMenuOpen;
        const open = Boolean(anchorEl);
        return(
            <div className="dashboard">
                {/* Dashboard located in the header; controls main navigation */}
                <AppBar position="static" color="default">
                    <Toolbar>
                        <div className="heading">
                            Dashboard
                        </div>

                        <Button variant="text" color="inherit" onClick={() => this.fetchData()}>
                            Get Data
                        </Button>

                        <IconButton variant="text" onClick={this.handleUserMenuOpen} color="inherit">
                            <Avatar>{this.state.userName[0][0] + this.state.userName[this.state.userName.length - 1][0]}</Avatar>
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {/* The Menu Items opened when user clicks on their icon */}
                <Menu anchorEl={anchorEl} open={open} PaperProps={{
                    style: {
                        maxHeight: 220,
                        width: 150,
                        float: 'right',
                    }
                }}>

                    {/* Name of Person */}
                    <ListItem>
                        <ListItemText primary={this.state.userName.join(" ")}/>
                    </ListItem>

                    <Divider/>

                    <MenuItem onClick={event => this.handleUserMenuClose(event, "Settings")}
                    selected={this.state.currUserMenuItem === "Settings"}>
                        Settings
                    </MenuItem>

                    <MenuItem onClick={event => this.handleUserMenuClose(event, "Logout")}
                    selected={this.state.currUserMenuItem === "Logout"}>
                        Logout
                    </MenuItem>
                </Menu>

                <div className="mainContainer">
                    <div className="trendsDetailedActivity">
                        <Trends className="trends"/>
                        <DetailedActivity className="detailedActivity"/>
                    </div>
                    <RecentActivity className="recentActivity"/>
                </div>
            </div>
        );
    }
}

export default HomePage;