import React, { Component } from 'react';
import Trends from './dashboard/Trends';
import AddTransaction from './dashboard/AddTransaction';
import DetailedActivity from './dashboard/DetailedActivity';
import RecentActivity from './dashboard/RecentActivity';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import firebase from 'firebase';
import { withSnackbar } from 'notistack';
import './Dashboard.css';
import { DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

const fetch = require('node-fetch');

class HomePage extends Component{

    constructor(props){
        super(props);

        // Bind all functions to "this"
        this.fetchData = this.fetchData.bind(this);
        this.updateData = this.updateData.bind(this);
        this.createTransaction = this.createTransaction.bind(this);

        this.handleUserMenuOpen = this.handleUserMenuOpen.bind(this);
        this.handleUserMenuClose = this.handleUserMenuClose.bind(this);
        this.handleAddTransactionDialogModalOpen = this.handleAddTransactionDialogModalOpen.bind(this);
        this.handleAddTransactionDialogModalClose = this.handleAddTransactionDialogModalClose.bind(this);

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
            transactionData: {},
            addTransactionDialogOpen: false,
        }
    }

    /**GET request to server.js API, response is transaction data */
    fetchData(){
        var endpoint = "http://127.0.0.1:5000/_api/fetchTransactions";

        var options = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "accessToken": localStorage.getItem("accessToken")
            },
        }

        fetch(endpoint, options)
        .then(res => {
            console.log(res);
            return res.json()})
        .then(resp => this.setState({transactionData: resp}))
        .catch((error) => console.log({"Error": error}));
    }

    /**POST request to store a new transaction
     * 
     * @param recordInformation The new record to store.
     */
    createTransaction(recordInformation){
        var endpoint = "http://127.0.0.1:5000/_api/createTransaction";
        
        var body = {
            title: recordInformation.title,
            amountSpent: recordInformation.amountSpent,
            date: recordInformation.date,
            location: recordInformation.location,
            category: recordInformation.category,
            additionalNotes: recordInformation.additionalNotes}

        var options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "accessToken": localStorage.getItem("accessToken")
            },
            body: JSON.stringify(body)
        }
        console.log(recordInformation);

        fetch(endpoint, options)
        .then(res => {
            // If response is good, display success message
            if(res.ok){
                this.props.enqueueSnackbar("Added Transaction!", {
                    variant: 'success',
                    preventDuplicate: true,
                    action: (key) => (
                        <Button variant="outlined" color="inherit" onClick={() => this.props.closeSnackbar(key)}>Got It</Button>
                    ),
                });
            } else{
                this.props.enqueueSnackbar("Unable to add transaction. Please try again later.", {
                    variant: 'error',
                    preventDuplicate: true,
                    action: (key) => (
                        <Button variant="outlined" color="inherit" onClick={() => this.props.closeSnackbar(key)}>Got It</Button>
                    ),
                });
            }

            console.log({res});
            return res.json()})
        .then(resp => console.log(resp))
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

    handleAddTransactionDialogModalOpen(){
        this.setState({addTransactionDialogOpen: true});
    }

    handleAddTransactionDialogModalClose(){
        this.setState({addTransactionDialogOpen: false});
    }

    /**Logout the current user via firebase.auth, and other house-keeping items */
    handleLogOut(){
        localStorage.removeItem("userName");
        localStorage.removeItem("userPhoto");
        localStorage.removeItem("accessToken");
        firebase.auth().signOut()
        .then(() => {
            // Take user to home screen
            window.location.href = "/";

        })
        .catch((err) => {
            console.log(err);
            alert("Error when trying to logout. Check console log for details");
        });
        
    }

    render(){
        // Determine if the user menu is open or not
        const {anchorEl} = this.state.userMenuOpen;
        const open = Boolean(anchorEl);
        const userPhoto = localStorage.getItem("userPhoto");
        const userDefaultPhoto = require("./assets/default_profile_pic.png");

        return(
            <div className="dashboard">
                {/* Dashboard located in the header; controls main navigation */}
                <AppBar position="static" color="default">
                    <Toolbar>
                        <div className="heading">
                            Dashboard
                        </div>

                        <Button variant="text" color="inherit" onClick={() => window.location.href = "/"}>
                            Home
                        </Button>

                        <Button variant="text" color="inherit" onClick={() => this.fetchData()}>
                            Get Data
                        </Button>

                        <Button variant="text" color="inherit" onClick={() => this.handleAddTransactionDialogModalOpen()}>
                            Add Data
                        </Button>

                        <IconButton variant="text" onClick={this.handleUserMenuOpen} color="inherit">
                            <Avatar src={userPhoto === "null" ? userDefaultPhoto : userPhoto}/>
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
                        <Trends className="trends" fetchData={this.fetchData}/>
                        <DetailedActivity className="detailedActivity" fetchData={this.fetchData} />
                    </div>
                    {/* <RecentActivity className="recentActivity"/> */}

                    {this.state.addTransactionDialogOpen &&
                    <AddTransaction handleAddTransactionDialogModalClose={this.handleAddTransactionDialogModalClose} createTransaction={this.createTransaction}/>}
                </div>
            </div>
        );
    }
}

export default withSnackbar(HomePage);